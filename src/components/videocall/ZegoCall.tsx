import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export interface ZegoCallProps {
  roomID: string;
  userID: string;
  userName: string;
  onClose?: () => void;
}

const ZegoCall: React.FC<ZegoCallProps> = ({ roomID, userID, userName, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zegoRef = useRef<any>(null);

  useEffect(() => {
    const initCall = async () => {
      if (!containerRef.current) return;
      
      try {
        console.log(`Initializing video call in room: ${roomID}`);
        console.log(`User: ${userID} (${userName})`);
        
        // Generate a Kit Token
        const appID = 64275671;
        const serverSecret = "2d4a5430b8b2633e9e3d04231c17fde9";
        
        // Ensure unique room and user IDs
        const uniqueRoomID = roomID;
        const uniqueUserID = userID;
        
        // Create token
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          uniqueRoomID,
          uniqueUserID,
          userName
        );
        
        // Create instance
        zegoRef.current = ZegoUIKitPrebuilt.create(kitToken);
        
        // Join room with enhanced configuration
        zegoRef.current.joinRoom({
          container: containerRef.current,
          sharedLinks: [{
            name: 'Copy link',
            url: window.location.href,
          }],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton: true,
          showRoomDetailsButton: true,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 2,
          layout: "Auto",
          showLayoutButton: false,
          onLeaveRoom: () => {
            console.log('User left the room');
            if (onClose) onClose();
          },
        });
        
        console.log('Video call initialized successfully');
      } catch (error) {
        console.error('Error initializing video call:', error);
      }
    };
    
    initCall();
    
    return () => {
      // Cleanup when component unmounts
      if (zegoRef.current) {
        try {
          zegoRef.current.destroy();
          console.log('Video call instance destroyed');
        } catch (error) {
          console.error('Error destroying video call instance:', error);
        }
      }
    };
  }, [roomID, userID, userName]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div
          ref={containerRef}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default ZegoCall;
