import React, { useState } from 'react';
import { Settings, Key, User, Stethoscope, CheckCircle, AlertCircle, Database, Palette, Globe, Heart, AlertTriangle } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { StorageManager } from './StorageManager';
import { DisclaimerPage } from './DisclaimerPage';

interface ConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    tavusSettings, 
    updateTavusSettings, 
    userPreferences, 
    updateUserPreferences,
    getStorageInfo 
  } = useAppState();
  
  const [tempApiKey, setTempApiKey] = useState(tavusSettings.apiKey);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [showStorageManager, setShowStorageManager] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [activeTab, setActiveTab] = useState<'api' | 'preferences' | 'storage'>('api');

  const handleSave = async () => {
    setIsValidating(true);
    try {
      // Basic validation - check if the key looks like a Tavus API key
      if (tempApiKey && tempApiKey.length > 10) {
        updateTavusSettings({ apiKey: tempApiKey });
        setValidationStatus('valid');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setValidationStatus('invalid');
      }
    } catch (error) {
      setValidationStatus('invalid');
    } finally {
      setIsValidating(false);
    }
  };

  const handlePreferenceChange = (key: keyof typeof userPreferences, value: any) => {
    updateUserPreferences({ [key]: value });
  };

  const storageInfo = getStorageInfo();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-red-800/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Medical Platform Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-300 transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-black/50 rounded-lg p-1 border border-red-800/30 flex-wrap">
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 min-w-0 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'api'
                ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg'
                : 'text-red-300 hover:text-white'
            }`}
          >
            API Settings
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 min-w-0 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg'
                : 'text-red-300 hover:text-white'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`flex-1 min-w-0 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'storage'
                ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg'
                : 'text-red-300 hover:text-white'
            }`}
          >
            Storage
          </button>
          <button
            onClick={() => setShowDisclaimer(true)}
            className="py-2 px-3 rounded-md text-sm font-medium transition-colors text-red-300 hover:text-white hover:bg-red-900/30 flex items-center space-x-1"
            title="View Medical Disclaimer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Disclaimer</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* API Settings Tab */}
          {activeTab === 'api' && (
            <>
          {/* Current Configuration */}
          <div className="bg-black/30 rounded-lg p-4 border border-red-800/30">
            <h3 className="text-sm font-medium text-white mb-3 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Current Medical AI Configuration</span>
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-300">Persona ID:</span>
                <span className="font-mono text-xs bg-red-900/30 px-2 py-1 rounded text-red-200">
                  {tavusSettings.personaId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-300">Replica ID:</span>
                <span className="font-mono text-xs bg-red-900/30 px-2 py-1 rounded text-red-200">
                  {tavusSettings.replicaId.slice(0, 12)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-300">Max Duration:</span>
                <span className="font-mono text-xs bg-red-900/30 px-2 py-1 rounded text-red-200">
                  {tavusSettings.maxDuration}s
                </span>
              </div>
            </div>
          </div>

          {/* API Key Configuration */}
          <div>
            <label className="block text-sm font-medium text-white mb-2 flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span>Tavus Medical AI API Key</span>
            </label>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Enter your Tavus API key..."
              className="w-full px-4 py-3 rounded-lg border border-red-700/50 bg-black/50 text-white placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all backdrop-blur-sm"
            />
            {validationStatus === 'valid' && (
              <div className="mt-2 flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">API key validated successfully!</span>
              </div>
            )}
            {validationStatus === 'invalid' && (
              <div className="mt-2 flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Invalid API key. Please check and try again.</span>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg p-4 border border-red-700/30">
            <div className="flex items-start space-x-3">
              <Heart className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-200 mb-1">
                  Need a Medical AI API Key?
                </h4>
                <p className="text-sm text-red-300">
                  Get your Tavus API key from the{' '}
                  <a
                    href="https://platform.tavus.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline text-red-400"
                  >
                    Tavus Platform
                  </a>{' '}
                  dashboard under API settings for medical consultations.
                </p>
              </div>
            </div>
          </div>
            </>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <>
              <div className="space-y-4">
                {/* Theme Settings */}
                <div className="border border-red-800/30 rounded-lg p-4 bg-black/30">
                  <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
                    <Palette className="w-4 h-4" />
                    <span>Medical Interface Appearance</span>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-red-300 mb-2">Theme</label>
                      <select
                        value={userPreferences.theme}
                        onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                        className="w-full px-3 py-2 border border-red-700/50 rounded-lg bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-red-300 mb-2">Video Quality</label>
                      <select
                        value={userPreferences.videoQuality}
                        onChange={(e) => handlePreferenceChange('videoQuality', e.target.value)}
                        className="w-full px-3 py-2 border border-red-700/50 rounded-lg bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="low">Low (480p)</option>
                        <option value="medium">Medium (720p)</option>
                        <option value="high">High (1080p)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Medical Preferences */}
                <div className="border border-red-800/30 rounded-lg p-4 bg-black/30">
                  <h4 className="font-medium text-white mb-3">Medical Consultation Preferences</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={userPreferences.videoEnabled}
                        onChange={(e) => handlePreferenceChange('videoEnabled', e.target.checked)}
                        className="w-4 h-4 text-red-600 border-red-700 rounded focus:ring-red-500 bg-black/50"
                      />
                      <span className="text-sm text-red-200">Enable video consultations by default</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={userPreferences.audioEnabled}
                        onChange={(e) => handlePreferenceChange('audioEnabled', e.target.checked)}
                        className="w-4 h-4 text-red-600 border-red-700 rounded focus:ring-red-500 bg-black/50"
                      />
                      <span className="text-sm text-red-200">Enable audio by default</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={userPreferences.autoStartVideo}
                        onChange={(e) => handlePreferenceChange('autoStartVideo', e.target.checked)}
                        className="w-4 h-4 text-red-600 border-red-700 rounded focus:ring-red-500 bg-black/50"
                      />
                      <span className="text-sm text-red-200">Auto-start video consultations</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={userPreferences.notifications}
                        onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                        className="w-4 h-4 text-red-600 border-red-700 rounded focus:ring-red-500 bg-black/50"
                      />
                      <span className="text-sm text-red-200">Enable medical notifications</span>
                    </label>
                  </div>
                </div>

                {/* Language Settings */}
                <div className="border border-red-800/30 rounded-lg p-4 bg-black/30">
                  <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Language</span>
                  </h4>
                  <select
                    value={userPreferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-red-700/50 rounded-lg bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Storage Tab */}
          {activeTab === 'storage' && (
            <>
              <div className="space-y-4">
                {/* Storage Info */}
                <div className="bg-black/30 rounded-lg p-4 border border-red-800/30">
                  <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
                    <Database className="w-4 h-4" />
                    <span>Medical Data Storage Overview</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-red-300">Consultations:</span>
                      <span className="ml-2 font-mono text-white">{storageInfo.conversationCount}</span>
                    </div>
                    <div>
                      <span className="text-red-300">Messages:</span>
                      <span className="ml-2 font-mono text-white">{storageInfo.messageCount}</span>
                    </div>
                    <div>
                      <span className="text-red-300">Data Size:</span>
                      <span className="ml-2 font-mono text-white">{storageInfo.dataSizeKB} KB</span>
                    </div>
                    <div>
                      <span className="text-red-300">Version:</span>
                      <span className="ml-2 font-mono text-white">{storageInfo.version}</span>
                    </div>
                  </div>
                </div>

                {/* Storage Actions */}
                <div className="border border-red-800/30 rounded-lg p-4 bg-black/30">
                  <h4 className="font-medium text-white mb-3">Medical Data Management</h4>
                  <p className="text-sm text-red-300 mb-4">
                    Manage your stored medical consultations, settings, and preferences.
                  </p>
                  <button
                    onClick={() => setShowStorageManager(true)}
                    className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-900 transition-colors flex items-center space-x-2 shadow-lg"
                  >
                    <Database className="w-4 h-4" />
                    <span>Open Storage Manager</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          {activeTab === 'api' && (
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-red-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isValidating || !tempApiKey}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isValidating ? 'Validating...' : 'Save Configuration'}
            </button>
          </div>
          )}
          
          {(activeTab === 'preferences' || activeTab === 'storage') && (
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-900 transition-colors shadow-lg"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
      
      {/* Storage Manager Modal */}
      <StorageManager
        isOpen={showStorageManager}
        onClose={() => setShowStorageManager(false)}
      />
      
      {/* Disclaimer Modal */}
      <DisclaimerPage
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />
    </>
  );
};