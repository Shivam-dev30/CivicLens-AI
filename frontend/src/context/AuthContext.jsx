import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('civic_token');
    if (token) {
      axios.get(`${API_URL}/me?token=${token}`)
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('civic_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await axios.post(`${API_URL}/login`, { username, password });
    const { access_token } = res.data;
    localStorage.setItem('civic_token', access_token);
    const userRes = await axios.get(`${API_URL}/me?token=${access_token}`);
    setUser(userRes.data);
    return userRes.data;
  };

  const logout = () => {
    localStorage.removeItem('civic_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
