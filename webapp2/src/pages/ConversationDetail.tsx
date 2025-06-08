import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Pause,
  Download,
  Share2,
  Clock,
  User,
  MessageSquare,
  Video,
  Calendar,
  Tag,
  MoreHorizontal
} from 'lucide-react';

// Mock data - in a real app, you'd fetch this based on the ID
const conversationDetail = {
  id: '1',
  user: {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'AJ'
  },
  topic: 'Product Demo Request',
  status: 'completed',
  duration: '5:23',
  videoUrl: 'https://example.com/video1.mp4',
  createdAt: '2024-01-15T10:30:00Z',
  lastActivity: '2024-01-15T10:35:23Z',
  tags: ['demo', 'sales', 'product'],
  messages: [
    {
      id: '1',
      type: 'user',
      content: 'Hi, I\'m interested in learning more about your AI video platform. Can you show me how it works?',
      timestamp: '2024-01-15T10:30:15Z',
      videoUrl: null
    },
    {
      id: '2',
      type: 'agent',
      content: 'Hello Alice! I\'d be happy to show you our AI video platform. Let me give you a personalized demo of our key features.',
      timestamp: '2024-01-15T10:30:45Z',
      videoUrl: 'https://example.com/demo-video-1.mp4'
    },
    {
      id: '3',
      type: 'user',
      content: 'That looks amazing! How does the real-time video generation work?',
      timestamp: '2024-01-15T10:32:10Z',
      videoUrl: null
    },
    {
      id: '4',
      type: 'agent',
      content: 'Great question! Our AI processes your input in real-time and generates personalized video responses. Here\'s how the technology works behind the scenes.',
      timestamp: '2024-01-15T10:32:30Z',
      videoUrl: 'https://example.com/demo-video-2.mp4'
    },
    {
      id: '5',
      type: 'user',
      content: 'What about pricing and integration options?',
      timestamp: '2024-01-15T10:34:20Z',
      videoUrl: null
    },
    {
      id: '6',
      type: 'agent',
      content: 'We offer flexible pricing plans and easy API integration. Let me walk you through our options and show you how simple it is to get started.',
      timestamp: '2024-01-15T10:34:45Z',
      videoUrl: 'https://example.com/demo-video-3.mp4'
    }
  ],
  metadata: {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    ipAddress: '192.168.1.100',
    location: 'San Francisco, CA',
    device: 'Desktop',
    referrer: 'https://google.com'
  }
};

export const ConversationDetail: React.FC = () => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePlayVideo = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setIsPlaying(true);
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log('Downloading conversation data...');
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing conversation...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/conversations"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Conversation Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {conversationDetail.topic}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownload}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleShare}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button className="text-gray-600 hover:text-gray-700 p-2">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          {currentVideoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="aspect-video bg-black">
                <video
                  src={currentVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Conversation Timeline
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {conversationDetail.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-2xl ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    } space-x-3`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.type === 'user'
                          ? 'bg-blue-500 ml-3'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 mr-3'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Video className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.videoUrl && (
                        <div className="mt-3">
                          <button
                            onClick={() => handlePlayVideo(message.videoUrl!)}
                            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            <span className="text-sm">Play Video Response</span>
                          </button>
                        </div>
                      )}
                      <p
                        className={`text-xs mt-2 ${
                          message.type === 'user'
                            ? 'text-blue-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {formatDate(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              User Information
            </h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {conversationDetail.user.avatar}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {conversationDetail.user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {conversationDetail.user.email}
                </p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  conversationDetail.status === 'completed'
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                    : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                }`}>
                  {conversationDetail.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                <span className="text-gray-900 dark:text-white">{conversationDetail.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Messages:</span>
                <span className="text-gray-900 dark:text-white">{conversationDetail.messages.length}</span>
              </div>
            </div>
          </div>

          {/* Conversation Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Created
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatDate(conversationDetail.createdAt)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Activity
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatDate(conversationDetail.lastActivity)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {conversationDetail.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Technical Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Device:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {conversationDetail.metadata.device}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Location:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {conversationDetail.metadata.location}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">IP Address:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-mono">
                  {conversationDetail.metadata.ipAddress}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Referrer:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {conversationDetail.metadata.referrer}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};