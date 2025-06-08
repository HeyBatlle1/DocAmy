import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Video,
  TrendingUp,
  Clock,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data
const conversationData = [
  { name: 'Mon', conversations: 45, videos: 38 },
  { name: 'Tue', conversations: 52, videos: 47 },
  { name: 'Wed', conversations: 48, videos: 41 },
  { name: 'Thu', conversations: 61, videos: 55 },
  { name: 'Fri', conversations: 55, videos: 49 },
  { name: 'Sat', conversations: 42, videos: 36 },
  { name: 'Sun', conversations: 38, videos: 32 },
];

const usageData = [
  { name: 'Video Calls', value: 45, color: '#3B82F6' },
  { name: 'Text Chat', value: 30, color: '#8B5CF6' },
  { name: 'Voice Only', value: 25, color: '#10B981' },
];

const stats = [
  {
    name: 'Total Conversations',
    value: '1,247',
    change: '+12%',
    changeType: 'increase',
    icon: MessageSquare,
    color: 'blue'
  },
  {
    name: 'Active Users',
    value: '892',
    change: '+8%',
    changeType: 'increase',
    icon: Users,
    color: 'green'
  },
  {
    name: 'Videos Generated',
    value: '3,456',
    change: '+23%',
    changeType: 'increase',
    icon: Video,
    color: 'purple'
  },
  {
    name: 'Avg Response Time',
    value: '2.3s',
    change: '-5%',
    changeType: 'decrease',
    icon: Clock,
    color: 'orange'
  },
];

const recentConversations = [
  {
    id: '1',
    user: 'Alice Johnson',
    topic: 'Product Demo',
    duration: '5:23',
    status: 'completed',
    timestamp: '2 minutes ago'
  },
  {
    id: '2',
    user: 'Bob Smith',
    topic: 'Customer Support',
    duration: '3:45',
    status: 'active',
    timestamp: '5 minutes ago'
  },
  {
    id: '3',
    user: 'Carol Davis',
    topic: 'Sales Inquiry',
    duration: '7:12',
    status: 'completed',
    timestamp: '8 minutes ago'
  },
  {
    id: '4',
    user: 'David Wilson',
    topic: 'Technical Help',
    duration: '4:56',
    status: 'processing',
    timestamp: '12 minutes ago'
  },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your AI conversations.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Export Data
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
            New Conversation
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'increase'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    vs last week
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue'
                    ? 'bg-blue-100 dark:bg-blue-900/20'
                    : stat.color === 'green'
                    ? 'bg-green-100 dark:bg-green-900/20'
                    : stat.color === 'purple'
                    ? 'bg-purple-100 dark:bg-purple-900/20'
                    : 'bg-orange-100 dark:bg-orange-900/20'
                }`}
              >
                <stat.icon
                  className={`w-6 h-6 ${
                    stat.color === 'blue'
                      ? 'text-blue-600 dark:text-blue-400'
                      : stat.color === 'green'
                      ? 'text-green-600 dark:text-green-400'
                      : stat.color === 'purple'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-orange-600 dark:text-orange-400'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Conversation Trends
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Conversations</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Videos</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conversationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line
                type="monotone"
                dataKey="conversations"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="videos"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Usage Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Usage Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={usageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {usageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {usageData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Conversations
            </h3>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentConversations.map((conversation) => (
            <div key={conversation.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {conversation.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {conversation.user}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {conversation.topic}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {conversation.duration}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {conversation.timestamp}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      conversation.status === 'completed'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : conversation.status === 'active'
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                    }`}
                  >
                    {conversation.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};