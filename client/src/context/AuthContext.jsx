import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  hashPassword,
  verifyPassword,
  sanitizeText,
  isValidEmail,
  isStrongPassword
} from '../utils/security';

const AuthContext = createContext();

const API_MODE = (import.meta.env.VITE_API_MODE || 'demo').toLowerCase();
const API_URL = import.meta.env.VITE_API_URL || '/api';

const STORAGE_KEY_USER = 'techcare_auth_user_v4';
const STORAGE_KEY_TOKEN = 'techcare_auth_token_v4';
const STORAGE_KEY_USERS_DB = 'techcare_registered_users_v4';

// Akun demo bawaan dengan hash SHA-256 + salt (tanpa menyimpan password plaintext di kode/storage)
const DEFAULT_USERS = [
  {
    id: 'usr-admin-1',
    name: 'Admin TechCare',
    email: 'admin@techcare.id',
    passwordHash: 'sha256$tcadm9021a7c4f1$be194f414834a9f2deb9e0c127228b4c2ecf70ee0c3333cf3dcb9ab1ce50a1e6',
    role: 'admin',
    phone: '081234567890',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'usr-buyer-1',
    name: 'Budi Santoso',
    email: 'buyer@techcare.id',
    passwordHash: 'sha256$tcbuy4418d9e2b3$e423c6f5ef967e78b42f59c2db68585dc1c43a0b8df954e0ddd23ca3029965fc',
    role: 'buyer',
    phone: '081298765432',
    isActive: true,
    createdAt: '2026-01-05T09:30:00Z'
  },
  {
    id: 'usr-buyer-2',
    name: 'Siti Rahmawati',
    email: 'siti.rahma@email.com',
    passwordHash: 'sha256$tcsit7731c0a8e5$669280596d7f0c902d3fbe1412c265fda57a8dc99053e8e9c2b4a0f72e50a322',
    role: 'buyer',
    phone: '085712398412',
    isActive: true,
    createdAt: '2026-01-12T14:20:00Z'
  }
];

function normalizeRole(role) {
  return role === 'admin' ? 'admin' : 'buyer';
}

function toPublicUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: normalizeRole(u.role),
    phone: u.phone || '',
    isActive: u.isActive !== false,
    createdAt: u.createdAt || u.created_at || new Date().toISOString()
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [authNotice, setAuthNotice] = useState('');
  const [pendingRedirectAction, setPendingRedirectAction] = useState(null);

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

  // Sinkronisasi sesi JWT bila berjalan dalam mode full-stack API
  useEffect(() => {
    if (API_MODE !== 'api') return;
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (!token) return;

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.user) {
          setUser(toPublicUser(data.user));
        } else {
          localStorage.removeItem(STORAGE_KEY_TOKEN);
          setUser(null);
        }
      })
      .catch(() => {
        // Biarkan sesi lokal bila backend sementara tidak terjangkau
      });
  }, []);

  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
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

  const finishAuthSuccess = (sessionUser) => {
    setUser(sessionUser);
    setIsAuthModalOpen(false);
    setAuthNotice('');

    if (pendingRedirectAction) {
      const fn = pendingRedirectAction;
      setPendingRedirectAction(null);
      fn(sessionUser);
    }
  };

  const login = async (email, password) => {
    const cleanEmail = sanitizeText(email, 190).toLowerCase();
    const cleanPass = String(password || '').trim();

    if (!isValidEmail(cleanEmail) || !cleanPass) {
      throw new Error('Masukkan alamat email yang valid dan password Anda.');
    }

    if (API_MODE === 'api') {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Email atau password tidak sesuai.');
      }
      if (data.token) localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
      const sessionUser = toPublicUser(data.user);
      finishAuthSuccess(sessionUser);
      return { success: true, user: sessionUser };
    }

    await new Promise((r) => setTimeout(r, 300));
    const usersList = getRegisteredUsers();
    const found = usersList.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      throw new Error('Email atau password tidak sesuai. Silakan periksa kembali.');
    }

    if (found.isActive === false) {
      throw new Error('Akun ini sedang dinonaktifkan oleh Administrator.');
    }

    const valid = await verifyPassword(cleanPass, found.passwordHash);
    if (!valid) {
      throw new Error('Email atau password tidak sesuai. Silakan periksa kembali.');
    }

    const sessionUser = toPublicUser(found);
    finishAuthSuccess(sessionUser);
    return { success: true, user: sessionUser };
  };

  const register = async ({ name, email, password, phone }) => {
    const cleanName = sanitizeText(name, 120);
    const cleanEmail = sanitizeText(email, 190).toLowerCase();
    const cleanPass = String(password || '').trim();
    const cleanPhone = sanitizeText(phone, 25);

    if (!cleanName || cleanName.length < 2) {
      throw new Error('Nama lengkap minimal 2 karakter.');
    }
    if (!isValidEmail(cleanEmail)) {
      throw new Error('Format alamat email tidak valid.');
    }
    if (!isStrongPassword(cleanPass)) {
      throw new Error('Password minimal 6 karakter demi keamanan akun Anda.');
    }

    if (API_MODE === 'api') {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password: cleanPass, phone: cleanPhone })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal melakukan registrasi.');
      }
      if (data.token) localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
      const sessionUser = toPublicUser(data.user);
      finishAuthSuccess(sessionUser);
      return { success: true, user: sessionUser };
    }

    await new Promise((r) => setTimeout(r, 350));
    const usersList = getRegisteredUsers();
    if (usersList.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('Email sudah terdaftar. Silakan gunakan menu Masuk.');
    }

    const passwordHash = await hashPassword(cleanPass);
    const newUser = {
      id: `usr-buyer-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: 'buyer',
      phone: cleanPhone,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    saveRegisteredUsers([...usersList, newUser]);
    const sessionUser = toPublicUser(newUser);
    finishAuthSuccess(sessionUser);
    return { success: true, user: sessionUser };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    setUser(null);
    setPendingRedirectAction(null);
  };

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

  // Akses cepat demo untuk pengujian presentasi (hanya aktif pada mode demo)
  const loginAsDemoRole = async (targetRole) => {
    if (API_MODE === 'api') {
      throw new Error('Mode API aktif: silakan masuk menggunakan form email dan password.');
    }
    await new Promise((r) => setTimeout(r, 220));
    const usersList = getRegisteredUsers();
    const targetEmail = targetRole === 'admin' ? 'admin@techcare.id' : 'buyer@techcare.id';
    const found = usersList.find((u) => u.email.toLowerCase() === targetEmail) || DEFAULT_USERS[0];
    const sessionUser = toPublicUser(found);
    finishAuthSuccess(sessionUser);
    return { success: true, user: sessionUser };
  };

  const loginAsAdminDemo = () => loginAsDemoRole('admin');
  const loginAsBuyerDemo = () => loginAsDemoRole('buyer');

  // === Admin User Management ===
  const getUsers = async () => {
    if (API_MODE === 'api') {
      const token = localStorage.getItem(STORAGE_KEY_TOKEN);
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, error: data.message };
      return { success: true, data: (data.users || []).map(toPublicUser) };
    }
    const list = getRegisteredUsers().map(toPublicUser);
    return { success: true, data: list };
  };

  const updateUserRole = async (userId, newRole) => {
    const normalized = normalizeRole(newRole);
    if (user && String(user.id) === String(userId)) {
      return { success: false, error: 'Anda tidak dapat mengubah role akun sendiri saat sedang login.' };
    }

    if (API_MODE === 'api') {
      const token = localStorage.getItem(STORAGE_KEY_TOKEN);
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: normalized === 'admin' ? 'admin' : 'customer' })
      });
      const data = await res.json();
      return res.ok && data.success ? { success: true } : { success: false, error: data.message };
    }

    const updated = getRegisteredUsers().map((u) =>
      String(u.id) === String(userId) ? { ...u, role: normalized } : u
    );
    saveRegisteredUsers(updated);
    return { success: true, data: updated.map(toPublicUser) };
  };

  const toggleUserActive = async (userId) => {
    if (user && String(user.id) === String(userId)) {
      return { success: false, error: 'Anda tidak dapat menonaktifkan akun Anda sendiri.' };
    }
    const updated = getRegisteredUsers().map((u) =>
      String(u.id) === String(userId) ? { ...u, isActive: u.isActive === false } : u
    );
    saveRegisteredUsers(updated);
    return { success: true, data: updated.map(toPublicUser) };
  };

  const createUserByAdmin = async ({ name, email, password, phone, role = 'buyer' }) => {
    const cleanName = sanitizeText(name, 120);
    const cleanEmail = sanitizeText(email, 190).toLowerCase();
    const cleanPass = String(password || '').trim();
    const cleanPhone = sanitizeText(phone, 25);

    if (!cleanName || !isValidEmail(cleanEmail) || !isStrongPassword(cleanPass)) {
      return { success: false, error: 'Nama, email valid, dan password minimal 6 karakter wajib diisi.' };
    }

    const usersList = getRegisteredUsers();
    if (usersList.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Email sudah terdaftar di sistem.' };
    }

    const passwordHash = await hashPassword(cleanPass);
    const newUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: normalizeRole(role),
      phone: cleanPhone,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updated = [...usersList, newUser];
    saveRegisteredUsers(updated);
    return { success: true, data: toPublicUser(newUser) };
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
        apiMode: API_MODE,
        login,
        register,
        logout,
        loginAsAdminDemo,
        loginAsBuyerDemo,
        getUsers,
        updateUserRole,
        toggleUserActive,
        createUserByAdmin,
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
