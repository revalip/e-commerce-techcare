import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'techcare_auth_user_v3';
const STORAGE_KEY_USERS_DB = 'techcare_registered_users_v3';

// Akun bawaan (Admin & Buyer Demo)
const DEFAULT_USERS = [
  {
    id: 'usr-admin-1',
    name: 'Admin TechCare',
    email: 'admin@techcare.id',
    password: 'admin', // juga bisa admin123
    role: 'admin',
    phone: '081234567890',
    createdAt: '2026-01-01'
  },
  {
    id: 'usr-buyer-1',
    name: 'Budi Santoso',
    email: 'buyer@techcare.id',
    password: 'buyer123',
    role: 'buyer',
    phone: '081298765432',
    createdAt: '2026-01-05'
  }
];

export function AuthProvider({ children }) {
  // Current logged in user (null = Guest)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Modal Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [authNotice, setAuthNotice] = useState('');
  const [pendingRedirectAction, setPendingRedirectAction] = useState(null);

  // Synchronize active user session to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Error saving user session:', e);
    }
  }, [user]);

  // Helper untuk membaca database user mock
  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_USERS;
    }
  };

  const saveRegisteredUsers = (usersList) => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(usersList));
    } catch (e) {
      console.error('Error saving users DB:', e);
    }
  };

  // Login handler
  const login = async (email, password) => {
    await new Promise((r) => setTimeout(r, 400)); // Latency palsu halus

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const usersList = getRegisteredUsers();
    
    // Cari user yang cocok
    const found = usersList.find((u) => {
      const emailMatch = u.email.toLowerCase() === cleanEmail;
      // Khusus admin bisa login dengan 'admin' atau 'admin123'
      const passMatch = u.email === 'admin@techcare.id'
        ? (cleanPass === 'admin' || cleanPass === 'admin123' || cleanPass === u.password)
        : u.password === cleanPass;
      return emailMatch && passMatch;
    });

    if (!found) {
      throw new Error('Email atau password tidak sesuai. Silakan periksa kembali.');
    }

    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role, // 'admin' atau 'buyer'
      phone: found.phone || ''
    };

    setUser(sessionUser);
    setIsAuthModalOpen(false);
    setAuthNotice('');

    // Jika ada aksi tertunda (misal redirect ke checkout)
    if (pendingRedirectAction) {
      pendingRedirectAction(sessionUser);
      setPendingRedirectAction(null);
    }

    return { success: true, user: sessionUser };
  };

  // Register handler (Selalu membuat akun Buyer)
  const register = async ({ name, email, password, phone }) => {
    await new Promise((r) => setTimeout(r, 500));

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanName || !cleanEmail || !cleanPass) {
      throw new Error('Nama lengkap, email, dan password wajib diisi.');
    }

    const usersList = getRegisteredUsers();
    if (usersList.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('Email sudah terdaftar. Silakan gunakan menu Masuk.');
    }

    const newUser = {
      id: `usr-buyer-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      role: 'buyer', // Buyer role
      phone: (phone || '').trim(),
      createdAt: new Date().toISOString()
    };

    const updatedList = [...usersList, newUser];
    saveRegisteredUsers(updatedList);

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone
    };

    setUser(sessionUser);
    setIsAuthModalOpen(false);
    setAuthNotice('');

    if (pendingRedirectAction) {
      pendingRedirectAction(sessionUser);
      setPendingRedirectAction(null);
    }

    return { success: true, user: sessionUser };
  };

  // Logout handler (kembali menjadi Guest)
  const logout = () => {
    setUser(null);
    setPendingRedirectAction(null);
  };

  // Buka modal auth
  const openAuthModal = (tab = 'login', notice = '', onRedirect = null) => {
    setAuthModalTab(tab);
    setAuthNotice(notice || '');
    if (onRedirect) {
      setPendingRedirectAction(() => onRedirect);
    } else {
      setPendingRedirectAction(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthNotice('');
    setPendingRedirectAction(null);
  };

  // Quick Demo Logins
  const loginAsAdminDemo = () => {
    return login('admin@techcare.id', 'admin');
  };

  const loginAsBuyerDemo = () => {
    return login('buyer@techcare.id', 'buyer123');
  };

  const isAdmin = user?.role === 'admin';
  const isBuyer = user?.role === 'buyer';
  const isGuest = !user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isBuyer,
        isGuest,
        login,
        register,
        logout,
        loginAsAdminDemo,
        loginAsBuyerDemo,
        isAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        authNotice,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
