import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, MessageSquare, BarChart3, Settings, Key, Users, Stethoscope, Heart, Activity, HeartPulse as Pulse } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Consultations', href: '/conversations', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'API Keys', href: '/api-keys', icon: Key },
  { name: 'Patients', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-gradient-to-b from-red-950 to-black pt-5 pb-4 overflow-y-auto border-r border-red-800/50">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center shadow-lg">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                DocAmy
              </h1>
              <p className="text-xs text-red-300">
                Medical Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors relative ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600/20 to-red-800/20 text-red-300 border border-red-700/30'
                    : 'text-red-200 hover:bg-red-900/30 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-800/20 rounded-md border border-red-700/30"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 relative z-10 ${
                    isActive
                      ? 'text-red-400'
                      : 'text-red-300 group-hover:text-red-200'
                  }`}
                />
                <span className="relative z-10">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Stats */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-red-800/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-300">Medical AI Status</span>
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-red-400 animate-pulse" />
                <span className="text-red-400 text-xs font-medium">Active</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-300">Consultations</span>
              <span className="text-white font-medium">1,247</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-300">This Month</span>
              <span className="text-white font-medium">+23%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex-shrink-0 px-4 pb-4">
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-4 text-white shadow-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Emergency Mode</span>
            </div>
            <p className="text-xs opacity-90 mb-3">
              Start urgent medical consultation
            </p>
            <button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-1">
              <Pulse className="w-3 h-3" />
              <span>Emergency Consult</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};