import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthService } from '../services/auth.service';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  initials: string;
  isEnabled?: boolean;
}

export interface Organization {
  companyName: string;
  shortName: string;
  logoBase64: string | null;
  brandColor: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  initialPollId: string | null;
  setInitialPollId: (id: string | null) => void;
  login: (phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshOrganization: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toInitials = (name: string) =>
  name ? name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialPollId, setInitialPollId] = useState<string | null>(null);

  const refreshOrganization = useCallback(async () => {
    try {
      const token = await AuthService.getToken();
      if (!token) return;
      const fresh = await AuthService.fetchOrganizationBranding();
      setOrganization(fresh);
    } catch {
      // silently keep cached data if network fails
    }
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const [storedUser, storedOrg] = await Promise.all([
          AuthService.getUser(),
          AuthService.getOrganization(),
        ]);
        if (storedUser) {
          storedUser.initials = toInitials(storedUser.name);
          setUser(storedUser);
        }
        if (storedOrg) {
          setOrganization(storedOrg);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }

      // Refresh org branding silently in the background
      refreshOrganization();
    };
    loadSession();
  }, [refreshOrganization]);

  const login = async (phoneNumber: string) => {
    const { user: userData, organization: orgData } = await AuthService.login(phoneNumber);
    userData.initials = toInitials(userData.name);
    setUser(userData);
    setOrganization(orgData || null);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    setOrganization(null);
    setInitialPollId(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      organization,
      isLoading,
      initialPollId,
      setInitialPollId,
      login,
      logout,
      refreshOrganization,
    }}>
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
