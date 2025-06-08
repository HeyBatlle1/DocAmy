import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Conversations } from './pages/Conversations';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { APIKeys } from './pages/APIKeys';
import { Users } from './pages/Users';
import { ConversationDetail } from './pages/ConversationDetail';

// Providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
              
              {/* Sidebar */}
              <Sidebar />
              
              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                
                <main className="flex-1 overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="container mx-auto px-6 py-8"
                  >
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/conversations" element={<Conversations />} />
                      <Route path="/conversations/:id" element={<ConversationDetail />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/api-keys" element={<APIKeys />} />
                      <Route path="/users" element={<Users />} />
                    </Routes>
                  </motion.div>
                </main>
              </div>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;