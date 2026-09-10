import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('nirikshan_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nirikshan_token');
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('nirikshan_user', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('nirikshan_token');
          localStorage.removeItem('nirikshan_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('nirikshan_token', data.token);
    localStorage.setItem('nirikshan_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('nirikshan_token');
    localStorage.removeItem('nirikshan_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
