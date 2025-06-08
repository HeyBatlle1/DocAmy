import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Key,
  Bell,
  Shield,
  Database,
  Globe,
  Palette,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      appName: 'DocAmy Dashboard',
      timezone: 'UTC',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      theme: 'system'
    },
    api: {
      tavusApiKey: '',
      webhookUrl: '',
      rateLimitPerMinute: 60,
      enableWebhooks: true,
      enableRateLimit: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      conversationAlerts: true,
      errorAlerts: true,
      weeklyReports: true
    },
    security: {
      sessionTimeout: 30,
      requireMFA: false,
      allowApiKeyAccess: true,
      logRetentionDays: 90,
      enableAuditLog: true
    },
    database: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      compressionEnabled: true
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'api', name: 'API Configuration', icon: Key },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'database', name: 'Database', icon: Database },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure your DocAmy dashboard preferences and integrations
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Save Status */}
      {saveStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center space-x-2 ${
            saveStatus === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}
        >
          {saveStatus === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          <span>
            {saveStatus === 'success'
              ? 'Settings saved successfully!'
              : 'Failed to save settings. Please try again.'}
          </span>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  General Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Application Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.appName}
                      onChange={(e) => updateSetting('general', 'appName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => updateSetting('general', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.general.theme}
                      onChange={(e) => updateSetting('general', 'theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* API Configuration */}
            {activeTab === 'api' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  API Configuration
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tavus API Key
                    </label>
                    <input
                      type="password"
                      value={settings.api.tavusApiKey}
                      onChange={(e) => updateSetting('api', 'tavusApiKey', e.target.value)}
                      placeholder="Enter your Tavus API key"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Get your API key from the Tavus platform dashboard
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      value={settings.api.webhookUrl}
                      onChange={(e) => updateSetting('api', 'webhookUrl', e.target.value)}
                      placeholder="https://your-domain.com/webhook"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rate Limit (requests per minute)
                    </label>
                    <input
                      type="number"
                      value={settings.api.rateLimitPerMinute}
                      onChange={(e) => updateSetting('api', 'rateLimitPerMinute', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.api.enableWebhooks}
                        onChange={(e) => updateSetting('api', 'enableWebhooks', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enable webhooks</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.api.enableRateLimit}
                        onChange={(e) => updateSetting('api', 'enableRateLimit', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enable rate limiting</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notification Settings
                </h2>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Notifications
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications via email
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Push Notifications
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive browser push notifications
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Conversation Alerts
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified about new conversations
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.conversationAlerts}
                      onChange={(e) => updateSetting('notifications', 'conversationAlerts', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Error Alerts
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified about system errors
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.errorAlerts}
                      onChange={(e) => updateSetting('notifications', 'errorAlerts', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Weekly Reports
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive weekly analytics reports
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReports}
                      onChange={(e) => updateSetting('notifications', 'weeklyReports', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </motion.div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Security Settings
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Log Retention (days)
                    </label>
                    <input
                      type="number"
                      value={settings.security.logRetentionDays}
                      onChange={(e) => updateSetting('security', 'logRetentionDays', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Require Multi-Factor Authentication
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Require MFA for all user accounts
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.security.requireMFA}
                        onChange={(e) => updateSetting('security', 'requireMFA', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Allow API Key Access
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow authentication via API keys
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.security.allowApiKeyAccess}
                        onChange={(e) => updateSetting('security', 'allowApiKeyAccess', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Enable Audit Log
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Log all user actions and system events
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.security.enableAuditLog}
                        onChange={(e) => updateSetting('security', 'enableAuditLog', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Database */}
            {activeTab === 'database' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Database Settings
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Backup Frequency
                    </label>
                    <select
                      value={settings.database.backupFrequency}
                      onChange={(e) => updateSetting('database', 'backupFrequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Retention Period (days)
                    </label>
                    <input
                      type="number"
                      value={settings.database.retentionPeriod}
                      onChange={(e) => updateSetting('database', 'retentionPeriod', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Auto Backup
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Automatically backup database
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.database.autoBackup}
                        onChange={(e) => updateSetting('database', 'autoBackup', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Compression Enabled
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Compress backup files to save space
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.database.compressionEnabled}
                        onChange={(e) => updateSetting('database', 'compressionEnabled', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};