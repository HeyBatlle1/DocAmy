import React from 'react';
import { Bell, Search, User, Moon, Sun, Menu, Heart, Activity } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-red-950/80 to-black/80 backdrop-blur-md shadow-sm border-b border-red-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button className="p-2 rounded-md text-red-300 hover:text-white hover:bg-red-900/50">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-red-400" />
              </div>
              <input
                type="text"
                placeholder="Search patients, consultations, analytics..."
                className="block w-full pl-10 pr-3 py-2 border border-red-700/50 rounded-lg bg-black/50 text-white placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-red-300 hover:bg-red-900/50 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-lg text-red-300 hover:bg-red-900/50 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-black animate-pulse"></span>
              </button>
            </div>

            {/* Medical Status */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-red-900/30 rounded-lg border border-red-700/30">
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-xs text-red-300 font-medium">Medical AI Online</span>
            </div>

            {/* User menu */}
            <div className="relative">
              <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-900/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center shadow-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">
                    Dr. Sarah Johnson
                  </p>
                  <p className="text-xs text-red-300">
                    Medical Administrator
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};