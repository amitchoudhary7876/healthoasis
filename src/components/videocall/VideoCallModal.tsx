import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface VideoCallModalProps {
  doctorId: number;
  doctorName: string;
  onClose: () => void;
}

// Constants for WebRTC
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const VideoCallModal: React.FC<VideoCallModalProps> = ({ doctorId, doctorName, onClose }) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // WebRTC state
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const callStartTimeRef = useRef<number | null>(null);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL;

  useEffect(() => {
    const initializeCall = async () => {
      try {
        // 1. Initialize WebSocket connection
        socketRef.current = io(SOCKET_URL);
        
        // 2. Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        localStreamRef.current = stream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // 3. Initialize peer connection
        peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);
        
        // 4. Add local tracks to peer connection
        stream.getTracks().forEach(track => {
          if (peerConnectionRef.current && localStreamRef.current) {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
          }
        });

        // 5. Set up event handlers for RTCPeerConnection
        setupPeerConnectionHandlers();
        
        // 6. Set up socket event handlers
        setupSocketHandlers();
        
        // 7. Initiate call
        initiateCall();
        
        // Start call timer
        callStartTimeRef.current = Date.now();
        callTimerRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - (callStartTimeRef.current || 0)) / 1000);
          setElapsedTime(elapsed);
        }, 1000);

        // Create call session in the database
        createCallSession();

      } catch (err) {
        console.error('Error initializing call:', err);
        setCallStatus('error');
        setErrorMessage('Failed to access camera or microphone. Please check your permissions.');
      }
    };

    initializeCall();

    // Cleanup function
    return () => {
      cleanupCall();
    };
  }, []);

  const setupPeerConnectionHandlers = () => {
    if (!peerConnectionRef.current) return;

    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit('ice-candidate', {
          candidate: event.candidate,
          doctorId
        });
      }
    };

    // Handle connection state changes
    peerConnectionRef.current.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnectionRef.current?.connectionState);
      if (peerConnectionRef.current?.connectionState === 'connected') {
        setCallStatus('connected');
      } else if (
        peerConnectionRef.current?.connectionState === 'failed' ||
        peerConnectionRef.current?.connectionState === 'disconnected' ||
        peerConnectionRef.current?.connectionState === 'closed'
      ) {
        setCallStatus('error');
        setErrorMessage('Connection lost. Please try again.');
      }
    };

    // Handle incoming tracks (remote video/audio)
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  };

  const setupSocketHandlers = () => {
    if (!socketRef.current) return;

    // Handle incoming offer
    socketRef.current.on('call-offer', async (data) => {
      if (!peerConnectionRef.current) return;
      
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        socketRef.current?.emit('call-answer', {
          answer,
          doctorId
        });
      } catch (err) {
        console.error('Error handling call offer:', err);
        setCallStatus('error');
        setErrorMessage('Failed to establish connection.');
      }
    });

    // Handle incoming answer
    socketRef.current.on('call-answer', async (data) => {
      if (!peerConnectionRef.current) return;
      
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      } catch (err) {
        console.error('Error handling call answer:', err);
        setCallStatus('error');
        setErrorMessage('Failed to establish connection.');
      }
    });

    // Handle incoming ICE candidates
    socketRef.current.on('ice-candidate', async (data) => {
      if (!peerConnectionRef.current) return;
      
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    });

    // Handle doctor unavailable event
    socketRef.current.on('doctor-unavailable', () => {
      setCallStatus('error');
      setErrorMessage('Doctor is currently unavailable for video call.');
    });

    // Handle call ended by doctor
    socketRef.current.on('call-ended', () => {
      setErrorMessage('Call ended by doctor.');
      onClose();
    });
  };

  const initiateCall = async () => {
    if (!peerConnectionRef.current || !socketRef.current) return;
    
    try {
      // Join the doctor's room
      socketRef.current.emit('join-doctor-room', { doctorId });
      
      // Create offer
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      // Send offer to the doctor
      socketRef.current.emit('call-offer', {
        offer,
        doctorId
      });
    } catch (err) {
      console.error('Error initiating call:', err);
      setCallStatus('error');
      setErrorMessage('Failed to initiate call.');
    }
  };

  const createCallSession = async () => {
    try {
      const response = await fetch(`${API_URL}/api/video-calls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId,
          startTime: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to create call session');
      }
    } catch (err) {
      console.error('Error creating call session:', err);
    }
  };

  const endCallSession = async () => {
    try {
      if (!callStartTimeRef.current) return;
      
      const duration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
      
      await fetch(`${API_URL}/api/video-calls/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId,
          endTime: new Date().toISOString(),
          duration,
        }),
      });
    } catch (err) {
      console.error('Error ending call session:', err);
    }
  };

  const cleanupCall = () => {
    // Stop timer
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    // Stop all local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    // End call session in the database
    endCallSession();
  };

  const handleEndCall = () => {
    socketRef.current?.emit('end-call', { doctorId });
    cleanupCall();
    onClose();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement recording functionality if needed
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="w-full max-w-6xl bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="text-white text-lg font-semibold">Call with Dr. {doctorName}</h3>
            <div className="ml-4 flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-gray-300 text-sm">
                {callStatus === 'connecting' ? 'Connecting...' : 'Connected'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">{formatTime(elapsedTime)}</span>
            <button 
              onClick={handleEndCall}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              End Call
            </button>
          </div>
        </div>
        
        {/* Video Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900 h-[600px]">
          {/* Remote Video (Doctor) */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden h-full flex items-center justify-center">
            {callStatus === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p>Connecting to Dr. {doctorName}...</p>
                </div>
              </div>
            )}
            {callStatus === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                <div className="text-white text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{errorMessage || 'Connection failed'}</p>
                </div>
              </div>
            )}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
              Dr. {doctorName}
            </div>
          </div>
          
          {/* Local Video (Patient) */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden h-full">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
              You
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="bg-gray-800 p-4 flex justify-center space-x-6">
          <button
            onClick={toggleMute}
            className={`flex flex-col items-center justify-center text-white ${
              isMuted ? 'text-red-500' : 'text-white'
            }`}
          >
            <div className={`p-3 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-700'}`}>
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </div>
            <span className="mt-1 text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>
          
          <button
            onClick={toggleVideo}
            className={`flex flex-col items-center justify-center ${
              isVideoOff ? 'text-red-500' : 'text-white'
            }`}
          >
            <div className={`p-3 rounded-full ${isVideoOff ? 'bg-red-600' : 'bg-gray-700'}`}>
              {isVideoOff ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <span className="mt-1 text-xs">{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
          </button>
          
          <button
            onClick={toggleRecording}
            className={`flex flex-col items-center justify-center ${
              isRecording ? 'text-red-500' : 'text-white'
            }`}
          >
            <div className={`p-3 rounded-full ${isRecording ? 'bg-red-600' : 'bg-gray-700'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="mt-1 text-xs">{isRecording ? 'Stop Recording' : 'Record'}</span>
          </button>
          
          <button
            onClick={handleEndCall}
            className="flex flex-col items-center justify-center text-white"
          >
            <div className="p-3 rounded-full bg-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </div>
            <span className="mt-1 text-xs">End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
