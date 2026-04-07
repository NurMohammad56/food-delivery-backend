import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/services';

const AuthContext = createContext(null);
const storageTokenKey = 'nub_food_token';
const storageUserKey = 'nub_food_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(storageTokenKey));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(storageUserKey);
    return raw ? JSON.parse(raw) : null;
  });
  const [bootstrapping, setBootstrapping] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setBootstrapping(false);
      return;
    }

    authApi.me()
      .then((response) => {
        const nextUser = response.data.data.user;
        setUser(nextUser);
        localStorage.setItem(storageUserKey, JSON.stringify(nextUser));
      })
      .catch(() => {
        localStorage.removeItem(storageTokenKey);
        localStorage.removeItem(storageUserKey);
        setToken(null);
        setUser(null);
      })
      .finally(() => setBootstrapping(false));
  }, [token]);

  const persistSession = (nextToken, nextUser) => {
    localStorage.setItem(storageTokenKey, nextToken);
    localStorage.setItem(storageUserKey, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(storageTokenKey);
    localStorage.removeItem(storageUserKey);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === 'admin',
    bootstrapping,
    persistSession,
    setUser,
    logout,
  }), [token, user, bootstrapping]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
