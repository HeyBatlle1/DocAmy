import React, { useState } from 'react';
import { Download, Upload, Trash2, Info, Database, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';

interface StorageManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorageManager: React.FC<StorageManagerProps> = ({ isOpen, onClose }) => {
  const { exportData, importData, clearAllData, getStorageInfo, isLoading } = useAppState();
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const storageInfo = getStorageInfo();

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tavus-app-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setNotification({ type: 'success', message: 'Data exported successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to export data' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) {
      setNotification({ type: 'error', message: 'Please paste JSON data to import' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      const success = await importData(importText);
      if (success) {
        setNotification({ type: 'success', message: 'Data imported successfully!' });
        setImportText('');
        setShowImport(false);
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: 'Invalid JSON data format' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to import data' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleClearAll = () => {
    clearAllData();
    setShowClearConfirm(false);
    setNotification({ type: 'success', message: 'All data cleared successfully!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportText(content);
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Storage Manager
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
            notification.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span className="text-sm">{notification.message}</span>
          </div>
        )}

        {/* Storage Info */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3 flex items-center space-x-2">
            <Info className="w-4 h-4" />
            <span>Storage Information</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600 dark:text-slate-400">Version:</span>
              <span className="ml-2 font-mono">{storageInfo.version}</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Data Size:</span>
              <span className="ml-2 font-mono">{storageInfo.dataSizeKB} KB</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Conversations:</span>
              <span className="ml-2 font-mono">{storageInfo.conversationCount}</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Messages:</span>
              <span className="ml-2 font-mono">{storageInfo.messageCount}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-600 dark:text-slate-400">Last Updated:</span>
              <span className="ml-2 font-mono text-xs">
                {new Date(storageInfo.lastUpdated).toLocaleString()}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-600 dark:text-slate-400">API Key:</span>
              <span className={`ml-2 ${storageInfo.hasApiKey ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {storageInfo.hasApiKey ? 'Configured' : 'Not Set'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* Export Data */}
          <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Download all your conversations, settings, and preferences as a JSON file.
            </p>
            <button
              onClick={handleExport}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>

          {/* Import Data */}
          <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Import Data</span>
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Restore your data from a previously exported JSON file.
            </p>
            
            {!showImport ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowImport(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Data</span>
                </button>
                <label className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Import File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste your exported JSON data here..."
                  className="w-full h-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleImport}
                    disabled={isLoading || !importText.trim()}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Importing...' : 'Import'}
                  </button>
                  <button
                    onClick={() => {
                      setShowImport(false);
                      setImportText('');
                    }}
                    className="bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Clear All Data */}
          <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-medium text-red-700 dark:text-red-400 mb-2 flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Clear All Data</span>
            </h4>
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">
              Permanently delete all conversations, settings, and preferences. This action cannot be undone.
            </p>
            
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                    Are you sure you want to delete all data? This will remove:
                  </p>
                  <ul className="text-sm text-red-600 dark:text-red-400 mt-2 list-disc list-inside">
                    <li>All conversations and messages</li>
                    <li>User preferences and settings</li>
                    <li>Tavus API configuration</li>
                    <li>All stored data</li>
                  </ul>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleClearAll}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Yes, Delete Everything
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};