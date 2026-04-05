'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  authenticate: (code: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  authenticate: () => false,
  logout: () => {},
});

const PASSCODE = '2617';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('our-explorer-auth');
    if (saved === 'true') setIsAuthenticated(true);
  }, []);

  const authenticate = (code: string) => {
    if (code === PASSCODE) {
      setIsAuthenticated(true);
      sessionStorage.setItem('our-explorer-auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('our-explorer-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
