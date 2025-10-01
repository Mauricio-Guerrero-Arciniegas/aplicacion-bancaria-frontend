import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) setTokenState(stored);
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) localStorage.setItem('token', newToken);
    else localStorage.removeItem('token');
    setTokenState(newToken);
  };

  const logout = () => setToken(null);

  return <AuthContext.Provider value={{ token, setToken, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);