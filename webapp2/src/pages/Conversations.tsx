import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Play,
  Pause,
  Clock,
  User,
  MessageSquare,
  Video,
  MoreHorizontal,
  Eye,
  Trash2,
  Archive
} from 'lucide-react';

// Mock data
const conversations = [
  {
    id: '1',
    user: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: 'AJ'
    },
    topic: 'Product Demo Request',
    status: 'completed',
    duration: '5:23',
    messageCount: 12,
    videoUrl: 'https://example.com/video1.mp4',
    createdAt: '2024-01-15T10:30:00Z',
    lastActivity: '2024-01-15T10:35:23Z',
    tags: ['demo', 'sales']
  },
  {
    id: '2',
    user: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: 'BS'
    },
    topic: 'Technical Support',
    status: 'active',
    duration: '3:45',
    messageCount: 8,
    videoUrl: null,
    createdAt: '2024-01-15T11:15:00Z',
    lastActivity: '2024-01-15T11:18:45Z',
    tags: ['support', 'technical']
  },
  {
    id: '3',
    user: {
      name: 'Carol Davis',
      email: 'carol@example.com',
      avatar: 'CD'
    },
    topic: 'Sales Inquiry',
    status: 'completed',
    duration: '7:12',
    messageCount: 15,
    videoUrl: 'https://example.com/video3.mp4',
    createdAt: '2024-01-15T09:20:00Z',
    lastActivity: '2024-01-15T09:27:12Z',
    tags: ['sales', 'inquiry']
  },
  {
    id: '4',
    user: {
      name: 'David Wilson',
      email: 'david@example.com',
      avatar: 'DW'
    },
    topic: 'Feature Request Discussion',
    status: 'processing',
    duration: '4:56',
    messageCount: 10,
    videoUrl: null,
    createdAt: '2024-01-15T08:45:00Z',
    lastActivity: '2024-01-15T08:49:56Z',
    tags: ['feature', 'feedback']
  },
  {
    id: '5',
    user: {
      name: 'Emma Brown',
      email: 'emma@example.com',
      avatar: 'EB'
    },
    topic: 'Onboarding Session',
    status: 'completed',
    duration: '12:34',
    messageCount: 25,
    videoUrl: 'https://example.com/video5.mp4',
    createdAt: '2024-01-14T16:30:00Z',
    lastActivity: '2024-01-14T16:42:34Z',
    tags: ['onboarding', 'training']
  }
];

const statusColors = {
  completed: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
  active: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
  processing: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
  error: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
};

export const Conversations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || conv.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectConversation = (id: string) => {
    setSelectedConversations(prev => 
      prev.includes(id) 
        ? prev.filter(convId => convId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedConversations.length === filteredConversations.length) {
      setSelectedConversations([]);
    } else {
      setSelectedConversations(filteredConversations.map(conv => conv.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Conversations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and analyze all AI video conversations
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center space-x-2">
            <Video className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="error">Error</option>
              </select>
            </div>

            {selectedConversations.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedConversations.length} selected
                </span>
                <button className="text-red-600 hover:text-red-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-700 p-1">
                  <Archive className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedConversations.length === filteredConversations.length && filteredConversations.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredConversations.map((conversation, index) => (
                <motion.tr
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedConversations.includes(conversation.id)}
                      onChange={() => handleSelectConversation(conversation.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {conversation.user.avatar}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {conversation.user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {conversation.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {conversation.topic}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        {conversation.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[conversation.status as keyof typeof statusColors]}`}>
                      {conversation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {conversation.duration}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {conversation.messageCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(conversation.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/conversations/${conversation.id}`}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {conversation.videoUrl && (
                        <button
                          className="text-green-600 hover:text-green-700 p-1"
                          title="Play Video"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="text-gray-600 hover:text-gray-700 p-1"
                        title="More Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
              <span className="font-medium">{filteredConversations.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};