import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import * as mockClient from "../api/mockClient";

export interface User {
  idUser: number;
  name: string;
  email: string;
  role: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const login = async (email: string, password: string) => {
    // Use mockClient which internally switches based on VITE_STATIC_MOCKS
    const data = await mockClient.login(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await mockClient.register(name, email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // helper to refresh profile from server
  const refreshProfile = async () => {
    if (!token) return;
    try {
      const profile = await mockClient.getProfile(token);
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
    } catch (e) {
      console.error("unable to refresh profile", e);
    }
  };

  const forgotPassword = async (email: string) => {
    return mockClient.forgotPassword(email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    return mockClient.resetPassword(token, newPassword);
  };

  const updateProfile = async (data: any) => {
    if (!token) throw new Error("Not authenticated");
    const updated = await mockClient.updateProfile(data, token);
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
