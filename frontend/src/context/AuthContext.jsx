import { createContext, useEffect, useState } from "react";
import { authApi, authExpirationStorage, tokenStorage } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionMessage, setSessionMessage] = useState("");

  useEffect(() => {
    const restoreSession = async () => {
      if (authExpirationStorage.get()) {
        setSessionMessage("Your session expired. Please log in again.");
        authExpirationStorage.clear();
      }

      const token = tokenStorage.get();

      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const profileResponse = await authApi.getProfile();
        setUser(profileResponse.user);
      } catch (_error) {
        tokenStorage.clear();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      tokenStorage.clear();
      setUser(null);
      setSessionMessage("Your session expired. Please log in again.");
    };

    window.addEventListener("studyvault:auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("studyvault:auth-expired", handleAuthExpired);
    };
  }, []);

  const persistAuth = (authData) => {
    tokenStorage.set(authData.token);
    setUser(authData.user);
  };

  const login = async (credentials) => {
    setIsLoading(true);

    try {
      const response = await authApi.login(credentials);
      persistAuth(response);
      setSessionMessage("");
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload) => {
    setIsLoading(true);

    try {
      const response = await authApi.register(payload);
      persistAuth(response);
      setSessionMessage("");
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    tokenStorage.clear();
    authExpirationStorage.clear();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isInitializing,
    isAuthenticated: Boolean(user),
    sessionMessage,
    clearSessionMessage: () => setSessionMessage(""),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
