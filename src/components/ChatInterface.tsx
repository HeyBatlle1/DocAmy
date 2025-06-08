import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Settings, Video, Loader2, User, Stethoscope, VideoIcon, Heart, Activity } from 'lucide-react';
import { ConfigPanel } from './ConfigPanel';
import { VideoChat } from './VideoChat';
import { useAppState } from '../hooks/useAppState';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  videoUrl?: string;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isLoading: boolean;
  currentVideoUrl?: string;
  onStartVideoChat?: () => void;
  isVideoCallActive?: boolean;
  onEndVideoCall?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  messages,
  isLoading,
  currentVideoUrl,
  onStartVideoChat,
  isVideoCallActive = false,
  onEndVideoCall
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const { tavusSettings } = useAppState();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording functionality
  };

  const handleStartVideoChat = () => {
    if (onStartVideoChat) {
      onStartVideoChat();
    }
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleEndVideoCall = () => {
    if (onEndVideoCall) {
      onEndVideoCall();
    }
  };

  return (
    <>
      {/* Video Chat Overlay */}
      <VideoChat
        isActive={isVideoCallActive}
        onToggleVideo={handleToggleVideo}
        onToggleAudio={handleToggleAudio}
        onEndCall={handleEndVideoCall}
        remoteVideoUrl={currentVideoUrl}
        isConnecting={isLoading}
      />

      <div className="flex flex-col h-full bg-gradient-to-br from-black via-red-950 to-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-900/80 to-black/80 backdrop-blur-md border-b border-red-800/50">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center shadow-lg">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              DocAmy
            </h1>
            <p className="text-sm text-red-200">
              AI Medical Consultation Platform
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Video Call Button */}
          <button
            onClick={handleStartVideoChat}
            disabled={!tavusSettings.apiKey || isLoading}
            className="p-2 rounded-lg hover:bg-red-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Start video consultation"
          >
            <VideoIcon className="w-5 h-5 text-red-200" />
          </button>
          
          {/* Settings Button */}
          <button 
            onClick={() => setShowConfig(true)}
            className="p-2 rounded-lg hover:bg-red-800/50 transition-colors"
          >
            <Settings className="w-5 h-5 text-red-200" />
          </button>
        </div>
      </div>

      {/* API Key Warning */}
      {!tavusSettings.apiKey && (
        <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Settings className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-200">
                Please configure your Tavus API key in settings to start medical consultations.
                <button
                  onClick={() => setShowConfig(true)}
                  className="ml-2 font-medium underline hover:no-underline text-red-300"
                >
                  Configure now
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Video Display Area */}
      {currentVideoUrl && (
        <div className="p-4 bg-gradient-to-r from-red-950 to-black">
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black border border-red-800/50">
            <video
              src={currentVideoUrl}
              autoPlay
              muted={false}
              className="w-full h-64 object-cover"
              controls
            />
            <div className="absolute top-4 right-4">
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2">
                <Heart className="w-3 h-3 animate-pulse" />
                <span>LIVE CONSULTATION</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center mb-6 shadow-lg">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Start Your Medical Consultation
            </h3>
            <p className="text-red-200 max-w-md mb-6">
              Describe your symptoms or medical concerns, and I'll provide professional guidance with personalized video responses.
            </p>
            {tavusSettings.apiKey && (
              <button
                onClick={handleStartVideoChat}
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all transform hover:scale-105 flex items-center space-x-3 shadow-lg animate-pulse"
              >
                <VideoIcon className="w-6 h-6" />
                <span className="font-semibold">Start your SHTF Emergency Consultation</span>
              </button>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-xs lg:max-w-md ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                } space-x-2`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-red-600 to-red-800 ml-2'
                      : 'bg-gradient-to-r from-red-700 to-red-900 mr-2'
                  } shadow-lg`}
                >
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Stethoscope className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-br-md'
                      : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-bl-md shadow-lg border border-red-800/30'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.videoUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      <video
                        src={message.videoUrl}
                        className="w-full h-32 object-cover"
                        controls
                      />
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      message.type === 'user'
                        ? 'text-red-100'
                        : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-2 mr-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-700 to-red-900 flex items-center justify-center shadow-lg">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 rounded-2xl rounded-bl-md shadow-lg border border-red-800/30">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                  <span className="text-sm text-white">
                    Analyzing symptoms and generating response...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gradient-to-r from-red-900/80 to-black/80 backdrop-blur-md border-t border-red-800/50">
        {/* Built with Bolt Attribution */}
        <div className="flex justify-end mb-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative px-3 py-1 bg-gradient-to-r from-black via-red-950 to-black rounded-lg leading-none flex items-center space-x-2">
              <svg className="w-3 h-3 text-red-400 animate-spin group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-red-400 font-mono group-hover:text-red-300 transition-colors duration-300">
                Built with Bolt
              </span>
              <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={tavusSettings.apiKey ? "Describe your symptoms or medical concerns..." : "Configure API key first..."}
              disabled={isLoading || !tavusSettings.apiKey}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-red-700/50 bg-black/50 text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            />
            <button
              onClick={toggleRecording}
              disabled={!tavusSettings.apiKey}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'hover:bg-red-800/50 text-red-300'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || !tavusSettings.apiKey}
            className="p-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Medical Disclaimer */}
        <div className="mt-3 text-center">
          <p className="text-xs text-red-400/70">
            DocAmy is not a medical doctor. This AI provides informational content only.
          </p>
        </div>
      </div>

      {/* Configuration Panel */}
      <ConfigPanel
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
      />
    </div>
    </>
  );
};