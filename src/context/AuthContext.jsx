import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getStoredToken, getStoredUser, setStoredToken, setStoredUser, clearStoredAuth } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState(getStoredUser);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session on app mount
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const existingToken = getStoredToken();
      if (!existingToken) {
        if (isMounted) {
          setIsLoading(false);
          setUser(null);
        }
        return;
      }

      try {
        const response = await authApi.getMe();
        if (response.success && response.data && isMounted) {
          setUser(response.data);
          setStoredUser(response.data);
        }
      } catch (err) {
        console.warn('Session restoration failed or expired:', err.message);
        if (isMounted) {
          clearStoredAuth();
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    if (response.success && response.data?.token) {
      const authToken = response.data.token;
      const authUser = response.data.user;

      setToken(authToken);
      setUser(authUser);
      setStoredToken(authToken);
      setStoredUser(authUser);

      return { success: true, user: authUser };
    }
    throw new Error(response.message || 'Login failed');
  };

  // Logout handler
  const logout = async () => {
    try {
      if (token) {
        await authApi.logout().catch(() => {});
      }
    } finally {
      clearStoredAuth();
      setToken(null);
      setUser(null);
    }
  };

  // RBAC Permission check helper
  const hasRole = (...roles) => {
    if (!user || !user.role) return false;
    if (roles.length === 0) return true;
    const userRoleLower = user.role.toLowerCase();
    return roles.some((r) => r.toLowerCase() === userRoleLower);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
