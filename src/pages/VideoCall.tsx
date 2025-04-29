import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  Button,
  CircularProgress,
  Snackbar,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socket = useRef<any>(null);
  const localStream = useRef<MediaStream | null>(null);

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
    socket.current = io('http://localhost:3000');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      localStream.current = stream;
      if (localVideo.current) localVideo.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      stream.getTracks().forEach(track => {
        peerConnection.current!.addTrack(track, stream);
      });

      peerConnection.current.ontrack = event => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = event => {
        if (event.candidate) {
          socket.current.emit('signal', { roomId, signalData: { candidate: event.candidate } });
        }
      };

      socket.current.emit('join-room', { roomId });

      socket.current.on('user-joined', async (userInfo: any) => {
        const offer = await peerConnection.current!.createOffer();
        await peerConnection.current!.setLocalDescription(offer);
        socket.current.emit('signal', { roomId, signalData: { offer } });

        if (userInfo?.name) {
          setRemoteUser(userInfo);
        }

        setIsLoading(false);
      });

      socket.current.on('signal', async ({ signalData, userInfo }) => {
        if (userInfo?.name) setRemoteUser(userInfo);

        if (signalData.offer) {
          await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(signalData.offer));
          const answer = await peerConnection.current!.createAnswer();
          await peerConnection.current!.setLocalDescription(answer);
          socket.current.emit('signal', { roomId, signalData: { answer } });
        } else if (signalData.answer) {
          await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(signalData.answer));
        } else if (signalData.candidate) {
          await peerConnection.current!.addIceCandidate(new RTCIceCandidate(signalData.candidate));
        }
      });

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
    }
  };

  const toggleCamera = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!videoTrack.enabled);
    }
  };

  const endCall = () => {
    localStream.current?.getTracks().forEach(track => track.stop());
    peerConnection.current?.close();
    socket.current?.disconnect();

    // TODO: Save to call log via backend here
    // axios.post('/api/log-call', { duration, participants })

    navigate('/');
    setSnackbarMessage('Call ended.');
  };

  const joinRoom = () => {
    setIsRequestPopupVisible(false);
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
