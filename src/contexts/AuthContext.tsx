// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Define User and AuthContextProps interfaces
interface User {
  email: string;
  name: string;
  password: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (userData: User) => boolean;
  changePassword: (oldPassword: string, newPassword: string) => boolean; // Thêm hàm changePassword
}

// Default value for the context
const defaultAuthContext: AuthContextProps = {
  user: null,
  login: () => false,
  logout: () => {},
  register: () => false,
  changePassword: () => false,
};

export const AuthContext = createContext<AuthContextProps>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find((u) => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = (userData: User): boolean => {
    const exists = users.some((u) => u.email === userData.email);
    if (exists) {
      return false; // Email đã tồn tại
    }
    const updatedUsers = [...users, userData];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return true;
  };

  // Hàm thay đổi mật khẩu
  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    if (!user) {
      console.log("No user logged in");
      return false;
    }

    // Kiểm tra mật khẩu cũ
    if (user.password !== oldPassword) {
      console.log("Old password is incorrect");
      return false;
    }

    // Cập nhật user trong state
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);

    // Cập nhật trong mảng users
    const updatedUsers = users.map((u) => u.email === user.email ? updatedUser : u);
    setUsers(updatedUsers);

    // Lưu vào localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    console.log("Password changed successfully");
    return true;
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('currentUser');
      setUser(storedUser ? JSON.parse(storedUser) : null);
      const storedUsers = localStorage.getItem('users');
      setUsers(storedUsers ? JSON.parse(storedUsers) : []);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
