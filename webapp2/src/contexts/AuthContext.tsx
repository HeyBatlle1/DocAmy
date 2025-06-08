import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Validate token and get user info
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      // Mock validation - replace with actual API call
      const mockUser: User = {
        id: '1',
        email: 'admin@docamy.com',
        full_name: 'Admin User',
        is_active: true
      };
      setUser(mockUser);
    } catch (error) {
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login - replace with actual API call
      if (email === 'admin@docamy.com' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          email: 'admin@docamy.com',
          full_name: 'Admin User',
          is_active: true
        };
        
        const mockToken = 'mock_jwt_token';
        localStorage.setItem('auth_token', mockToken);
        setUser(mockUser);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};