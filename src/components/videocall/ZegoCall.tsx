import React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export interface ZegoCallProps {
  roomID: string;
  userID: string;
  userName: string;
  onClose?: () => void;
}

const ZegoCall: React.FC<ZegoCallProps> = ({ roomID, userID, userName, onClose }) => {
  const myMeeting = async (element: HTMLDivElement) => {
    // Generate a Kit Token
    const appID = 64275671;
    const serverSecret = "2d4a5430b8b2633e9e3d04231c17fde9";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    // Create instance object from Kit Token
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    
    // Start the call
    zp.joinRoom({
      container: element,
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,
      maxUsers: 2,
      layout: "Auto",
      showLayoutButton: false,
      scenario: {
        mode: "OneOnOneCall" as any,
        config: {
          role: "Host" as any,
        },
      },
      onLeaveRoom: onClose,
    });
  };

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
          className="w-full h-full"
          ref={myMeeting}
        />
      </div>
    </div>
  );
};

export default ZegoCall;
