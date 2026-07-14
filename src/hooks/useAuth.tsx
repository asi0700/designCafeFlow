import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '../types';
import { mockEmployees } from '../mock-data/employees';

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('cf_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((role: UserRole) => {
    const user = mockEmployees.find(e => e.role === role) ?? mockEmployees[0];
    setCurrentUser(user);
    localStorage.setItem('cf_user', JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('cf_user');
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const user = mockEmployees.find(e => e.role === role) ?? mockEmployees[0];
    setCurrentUser(user);
    localStorage.setItem('cf_user', JSON.stringify(user));
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
