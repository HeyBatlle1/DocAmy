import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  Video,
  Activity,
  Calendar,
  Download,
  Filter
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
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Mock data
const dailyMetrics = [
  { date: '2024-01-08', conversations: 45, users: 32, videos: 38, avgDuration: 4.2 },
  { date: '2024-01-09', conversations: 52, users: 41, videos: 47, avgDuration: 3.8 },
  { date: '2024-01-10', conversations: 48, users: 38, videos: 41, avgDuration: 4.5 },
  { date: '2024-01-11', conversations: 61, users: 48, videos: 55, avgDuration: 3.9 },
  { date: '2024-01-12', conversations: 55, users: 44, videos: 49, avgDuration: 4.1 },
  { date: '2024-01-13', conversations: 42, users: 35, videos: 36, avgDuration: 4.7 },
  { date: '2024-01-14', conversations: 38, users: 29, videos: 32, avgDuration: 5.1 },
];

const hourlyActivity = [
  { hour: '00', activity: 5 },
  { hour: '01', activity: 3 },
  { hour: '02', activity: 2 },
  { hour: '03', activity: 1 },
  { hour: '04', activity: 2 },
  { hour: '05', activity: 4 },
  { hour: '06', activity: 8 },
  { hour: '07', activity: 15 },
  { hour: '08', activity: 25 },
  { hour: '09', activity: 35 },
  { hour: '10', activity: 42 },
  { hour: '11', activity: 38 },
  { hour: '12', activity: 45 },
  { hour: '13', activity: 40 },
  { hour: '14', activity: 48 },
  { hour: '15', activity: 52 },
  { hour: '16', activity: 46 },
  { hour: '17', activity: 38 },
  { hour: '18', activity: 28 },
  { hour: '19', activity: 22 },
  { hour: '20', activity: 18 },
  { hour: '21', activity: 15 },
  { hour: '22', activity: 12 },
  { hour: '23', activity: 8 },
];

const conversationTypes = [
  { name: 'Sales Inquiries', value: 35, color: '#3B82F6' },
  { name: 'Support Requests', value: 28, color: '#8B5CF6' },
  { name: 'Product Demos', value: 22, color: '#10B981' },
  { name: 'Onboarding', value: 15, color: '#F59E0B' },
];

const responseTimeData = [
  { time: '0-1s', count: 45 },
  { time: '1-2s', count: 38 },
  { time: '2-3s', count: 25 },
  { time: '3-4s', count: 18 },
  { time: '4-5s', count: 12 },
  { time: '5s+', count: 8 },
];

const topUsers = [
  { name: 'Alice Johnson', conversations: 15, totalTime: '2h 34m', avgRating: 4.8 },
  { name: 'Bob Smith', conversations: 12, totalTime: '1h 56m', avgRating: 4.6 },
  { name: 'Carol Davis', conversations: 11, totalTime: '2h 12m', avgRating: 4.9 },
  { name: 'David Wilson', conversations: 9, totalTime: '1h 43m', avgRating: 4.5 },
  { name: 'Emma Brown', conversations: 8, totalTime: '1h 28m', avgRating: 4.7 },
];

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('conversations');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const stats = [
    {
      name: 'Total Conversations',
      value: '1,247',
      change: '+12.5%',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      name: 'Unique Users',
      value: '892',
      change: '+8.2%',
      changeType: 'increase',
      icon: Users,
      color: 'green'
    },
    {
      name: 'Avg Response Time',
      value: '2.3s',
      change: '-15.3%',
      changeType: 'decrease',
      icon: Clock,
      color: 'purple'
    },
    {
      name: 'Video Generation Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'increase',
      icon: Video,
      color: 'orange'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights into your AI conversation performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
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
                    vs last period
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

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Daily Trends
            </h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="conversations">Conversations</option>
              <option value="users">Users</option>
              <option value="videos">Videos</option>
              <option value="avgDuration">Avg Duration</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                tickFormatter={formatDate}
              />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                labelFormatter={(value) => formatDate(value)}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hourly Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Activity by Hour
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="hour" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="activity" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Conversation Types
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={conversationTypes}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {conversationTypes.map((entry, index) => (
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
            {conversationTypes.map((item) => (
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

        {/* Response Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Response Time Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={responseTimeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="time" type="category" stroke="#6B7280" width={50} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Top Active Users
          </h3>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={user.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.conversations} conversations
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {user.totalTime}
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-yellow-500">★</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {user.avgRating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};