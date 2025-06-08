import React, { useRef, useEffect, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Camera, Settings, Heart, Activity } from 'lucide-react';

interface VideoChatProps {
  isActive: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onEndCall: () => void;
  remoteVideoUrl?: string;
  isConnecting?: boolean;
}

export const VideoChat: React.FC<VideoChatProps> = ({
  isActive,
  onToggleVideo,
  onToggleAudio,
  onEndCall,
  remoteVideoUrl,
  isConnecting = false
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  // Get available media devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableDevices(videoDevices);
        if (videoDevices.length > 0 && !selectedCamera) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error getting media devices:', error);
      }
    };

    getDevices();
  }, [selectedCamera]);

  // Initialize camera when video chat becomes active
  useEffect(() => {
    if (isActive && !localStream) {
      startLocalVideo();
    } else if (!isActive && localStream) {
      stopLocalVideo();
    }

    return () => {
      if (localStream) {
        stopLocalVideo();
      }
    };
  }, [isActive]);

  // Update remote video source
  useEffect(() => {
    if (remoteVideoRef.current && remoteVideoUrl) {
      remoteVideoRef.current.src = remoteVideoUrl;
    }
  }, [remoteVideoUrl]);

  const startLocalVideo = async () => {
    try {
      setCameraError(null);
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError(
        error instanceof Error 
          ? error.message 
          : 'Unable to access camera. Please check permissions.'
      );
    }
  };

  const stopLocalVideo = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
    onToggleVideo();
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
    onToggleAudio();
  };

  const switchCamera = async (deviceId: string) => {
    setSelectedCamera(deviceId);
    if (localStream && isActive) {
      stopLocalVideo();
      // Small delay to ensure cleanup
      setTimeout(() => {
        startLocalVideo();
      }, 100);
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-red-950 to-black z-50 flex flex-col">
      {/* Video Container */}
      <div className="flex-1 relative">
        {/* Remote Video (Medical AI) */}
        <div className="w-full h-full relative">
          {remoteVideoUrl ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              controls={false}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-950 via-black to-red-900 flex items-center justify-center">
              {isConnecting ? (
                <div className="text-center text-white">
                  <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-xl font-semibold">Connecting to Medical AI...</p>
                  <p className="text-red-300 mt-2">Preparing your consultation</p>
                </div>
              ) : (
                <div className="text-center text-white">
                  <Heart className="w-20 h-20 mx-auto mb-6 opacity-50 text-red-400" />
                  <p className="text-xl font-semibold">Waiting for medical consultation...</p>
                </div>
              )}
            </div>
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-red-500/30">
            {cameraError ? (
              <div className="w-full h-full bg-red-900/50 flex items-center justify-center text-white text-xs text-center p-2">
                <div>
                  <Camera className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p>{cameraError}</p>
                </div>
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${!isVideoEnabled ? 'opacity-0' : ''}`}
              />
            )}
            {!isVideoEnabled && !cameraError && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-white opacity-50" />
              </div>
            )}
          </div>

          {/* Connection Status */}
          {isConnecting && (
            <div className="absolute top-4 left-4 bg-red-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 border border-red-500/30">
              <Activity className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-sm font-medium">Medical AI Connecting...</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-r from-red-900/90 to-black/90 backdrop-blur-sm p-6 border-t border-red-800/50">
        <div className="flex items-center justify-center space-x-6">
          {/* Camera Selection */}
          {availableDevices.length > 1 && (
            <div className="relative">
              <select
                value={selectedCamera}
                onChange={(e) => switchCamera(e.target.value)}
                className="bg-black/50 text-white border border-red-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 backdrop-blur-sm"
              >
                {availableDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId} className="bg-gray-800">
                    {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all transform hover:scale-105 shadow-lg ${
              isVideoEnabled
                ? 'bg-red-800/50 text-white hover:bg-red-700/60'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all transform hover:scale-105 shadow-lg ${
              isAudioEnabled
                ? 'bg-red-800/50 text-white hover:bg-red-700/60'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {/* Status Info */}
        <div className="mt-4 text-center text-red-200 text-sm">
          <p>
            Video: {isVideoEnabled ? 'On' : 'Off'} • 
            Audio: {isAudioEnabled ? 'On' : 'Off'} • 
            {localStream ? 'Camera Connected' : 'Camera Disconnected'}
          </p>
          <p className="text-xs text-red-300 mt-1">
            Secure Medical Consultation in Progress
          </p>
        </div>
      </div>
    </div>
  );
};