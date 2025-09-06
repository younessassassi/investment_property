import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from './types';
import { AuthService } from './service';

interface AuthContextType extends AuthState {
  signIn: (email: string) => Promise<void>;
  signUp: (email: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setAuthState({ user, isAuthenticated: true });
    }
  }, []);

  const signIn = async (email: string) => {
    try {
      const user = AuthService.signIn(email);
      setAuthState({ user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string) => {
    try {
      const user = AuthService.signUp(email);
      setAuthState({ user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    AuthService.signOut();
    setAuthState({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
