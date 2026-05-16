import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services/auth.service';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  initials: string;
  isEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AuthService.getUser();
        if (storedUser) {
          storedUser.initials = storedUser.name ? storedUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (phoneNumber: string) => {
    const userData = await AuthService.login(phoneNumber);
    userData.initials = userData.name ? userData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
    setUser(userData);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
