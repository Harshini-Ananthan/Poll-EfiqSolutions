import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthService } from '../services/auth.service';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  mobileNo?: string;
  countryCode?: string;
  email?: string;
  department?: string;
  initials: string;
  isEnabled?: boolean;
}

export interface Organization {
  companyName: string;
  shortName: string;
  logoBase64: string | null;
  brandColor: string;
  darkMode?: boolean;
  compactMode?: boolean;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  initialPollId: string | null;
  setInitialPollId: (id: string | null) => void;
  login: (phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshOrganization: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toInitials = (name: string) =>
  name ? name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

const normalizeUser = (user: User): User => {
  const phoneNumber = user.phoneNumber || user.mobileNo || '';
  return {
    ...user,
    phoneNumber,
    mobileNo: user.mobileNo || phoneNumber,
    initials: toInitials(user.name),
  };
};

const refreshCurrentUser = async (fallbackUser?: User | null) => {
  const token = await AuthService.getToken();
  if (!token) return fallbackUser ? normalizeUser(fallbackUser) : null;

  try {
    const freshUser = normalizeUser(await AuthService.fetchCurrentUser());
    await AuthService.saveUser(freshUser);
    return freshUser;
  } catch {
    return fallbackUser ? normalizeUser(fallbackUser) : null;
  }
};

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

  const refreshUser = useCallback(async () => {
    const freshUser = await refreshCurrentUser();
    if (!freshUser) return;
    setUser(freshUser);
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const [storedUser, storedOrg] = await Promise.all([
          AuthService.getUser(),
          AuthService.getOrganization(),
        ]);
        if (storedUser) {
          const normalizedUser = await refreshCurrentUser(storedUser);
          if (!normalizedUser) return;
          await AuthService.saveUser(normalizedUser);
          setUser(normalizedUser);
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
    const normalizedUser = normalizeUser({
      ...userData,
      phoneNumber: userData.phoneNumber || userData.mobileNo || phoneNumber,
      mobileNo: userData.mobileNo || userData.phoneNumber || phoneNumber,
    });
    await AuthService.saveUser(normalizedUser);
    setUser(normalizedUser);
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
      refreshUser,
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
