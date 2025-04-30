import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  Button,
  CircularProgress,
  Snackbar,
  Avatar,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { v4 as uuidv4 } from 'uuid';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

// ZegoCloud App ID and AppSign (replace with your actual credentials)
const ZEGO_APP_ID = 64275671; // Replace with your ZegoCloud App ID
const ZEGO_SERVER_SECRET = '2d4a5430b8b2633e9e3d04231c17fde9'; // Replace with your ZegoCloud Server Secret

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const zegoEngine = useRef<any>(null);
  const socket = useRef<any>(null);
  const localStream = useRef<MediaStream | null>(null);
  const userId = useRef<string>(uuidv4());

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isRequestPopupVisible, setIsRequestPopupVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const maxDuration = 3600;

  const [localUser, setLocalUser] = useState({ name: "You", avatar: "" });
  const [remoteUser, setRemoteUser] = useState({ name: "Connecting...", avatar: "" });

  useEffect(() => {
    // Use the deployed backend URL for socket connection
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://healthoasis-backendf.onrender.com';
    socket.current = io(API_URL);

    // Initialize ZegoCloud engine
    zegoEngine.current = new ZegoExpressEngine(ZEGO_APP_ID, ZEGO_SERVER_SECRET);
    
    // Log in to ZegoCloud with a unique user ID
    zegoEngine.current.loginRoom(
      roomId as string,
      userId.current,
      { userID: userId.current, userName: localUser.name },
      { userUpdate: true }
    ).then(() => {
      console.log('Successfully logged into ZegoCloud room:', roomId);
      
      // Create a local stream and publish
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        localStream.current = stream;
        if (localVideo.current) {
          localVideo.current.srcObject = stream;
          // Preview local stream
          zegoEngine.current.startPreview(localVideo.current as HTMLElement);
        }
        // Publish local stream
        zegoEngine.current.startPublishingStream(userId.current, stream);
        setIsLoading(false);
      }).catch(error => {
        console.error('Failed to get user media:', error);
        setSnackbarMessage('Failed to access camera or microphone. Please check your permissions.');
      });
      
      // Listen for remote user streams
      zegoEngine.current.on('roomStreamUpdate', ({ type, streamList }: any) => {
        if (type === 'ADD') {
          const remoteStream = streamList[0];
          if (remoteStream && remoteVideo.current) {
            // Play the remote stream
            zegoEngine.current.startPlayingStream(
              remoteStream.streamID,
              remoteVideo.current as HTMLElement
            );
            
            // Update remote user info
            setRemoteUser({
              name: remoteStream.user.userName || 'Remote User',
              avatar: ''
            });
          }
        } else if (type === 'DELETE') {
          // Remote user left
          setSnackbarMessage('Remote user has left the call.');
        }
      });
      
      // Handle errors
      zegoEngine.current.on('roomError', (error: any) => {
        console.error('ZegoCloud room error:', error);
        setSnackbarMessage(`Connection error: ${error.code}`);
      });
      
    }).catch((error: any) => {
      console.error('Failed to join ZegoCloud room:', error);
      setSnackbarMessage('Failed to join video call room. Please try again.');
    });

    const timer = setInterval(() => {
      setCallDuration(prev => Math.min(prev + 1, maxDuration));
    }, 1000);

    return () => {
      clearInterval(timer);
      socket.current?.disconnect();
    };
  }, [roomId]);

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      
      // Update ZegoCloud audio settings
      zegoEngine.current.mutePublishStreamAudio(userId.current, !audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!videoTrack.enabled);
      
      // Update ZegoCloud video settings
      zegoEngine.current.mutePublishStreamVideo(userId.current, !videoTrack.enabled);
    }
  };

  const endCall = () => {
    // Stop local tracks
    localStream.current?.getTracks().forEach(track => track.stop());
    
    // Log out from ZegoCloud room
    if (zegoEngine.current) {
      zegoEngine.current.stopPublishingStream(userId.current);
      zegoEngine.current.logoutRoom(roomId as string);
      zegoEngine.current.destroyStream(localStream.current);
    }
    
    // Disconnect socket
    socket.current?.disconnect();

    // Log call end to backend
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://healthoasis-backendf.onrender.com';
    fetch(`${API_URL}/api/video-calls/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId,
        endTime: new Date(),
        duration: callDuration
      }),
    }).catch(error => {
      console.error('Error logging call end:', error);
    });

    navigate('/');
    setSnackbarMessage('Call ended.');
  };

  const joinRoom = () => {
    setIsRequestPopupVisible(false);
    // User info will be sent to ZegoCloud when logging in
    socket.current.emit('join-room', { roomId, userInfo: localUser });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white p-4">
      {/* Join Confirmation */}
      {isRequestPopupVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-10"
        >
          <div className="bg-white p-6 rounded-lg shadow-2xl text-black w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4">Join Call Room?</h2>
            <Button fullWidth variant="contained" onClick={joinRoom}>Join Now</Button>
          </div>
        </motion.div>
      )}

      {/* Videos */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl items-center justify-between gap-4 mb-6">
        {/* Local User */}
        <div className="relative w-full md:w-1/2 bg-black rounded-xl shadow-lg aspect-video">
          {!isCameraOff ? (
            <video ref={localVideo} autoPlay muted className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Avatar src={localUser.avatar} sx={{ width: 64, height: 64 }} />
              <p className="text-white mt-2">Camera Off</p>
            </div>
          )}
          <div className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-50 p-1 px-2 rounded">{localUser.name}</div>
        </div>

        {/* Remote User */}
        <div className="relative w-full md:w-1/2 bg-black rounded-xl shadow-lg aspect-video">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <CircularProgress />
            </div>
          ) : (
            <video ref={remoteVideo} autoPlay className="w-full h-full object-cover rounded-xl" />
          )}
          <div className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-50 p-1 px-2 rounded">{remoteUser.name}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={toggleMute}
          variant="contained"
          sx={{ backgroundColor: isMuted ? '#6b7280' : '#ef4444', borderRadius: '50%' }}
        >
          {isMuted ? <MicOffIcon /> : <MicIcon />}
        </Button>
        <Button
          onClick={toggleCamera}
          variant="contained"
          sx={{ backgroundColor: isCameraOff ? '#6b7280' : '#3b82f6', borderRadius: '50%' }}
        >
          {isCameraOff ? <VideocamOffIcon /> : <VideocamIcon />}
        </Button>
        <Button
          onClick={endCall}
          variant="contained"
          sx={{ backgroundColor: '#dc2626', borderRadius: '50%' }}
        >
          <CallEndIcon />
        </Button>
      </div>

      {/* Call Timer */}
      <div className="mt-4 text-sm text-white">
        Call Time: {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
      </div>

      {/* Snackbar */}
      <Snackbar
        open={!!snackbarMessage}
        message={snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage('')}
      />
    </div>
  );
};

export default VideoCall;
