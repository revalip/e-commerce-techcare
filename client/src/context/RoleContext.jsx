import React from 'react';
import { useAuth } from './AuthContext';

/**
 * RoleProvider & useRole Compatibility Layer
 * Mengarahkan state role murni berdasarkan user login di AuthContext.
 */
export function RoleProvider({ children }) {
  return <>{children}</>;
}

export function useRole() {
  const { user, isAdmin, isBuyer, isGuest, logout } = useAuth();
  return {
    role: user ? user.role : 'guest',
    user,
    isAdmin,
    isBuyer,
    isGuest,
    logout
  };
}
