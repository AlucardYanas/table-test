import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = (): { isAuthenticated: boolean, login: (username: string, password: string) => Promise<void>, logout: () => void } => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(
        'https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/login',
        { username, password }
      );
      const {token} = (response.data as { token: string });
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout: () => void = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};

export default useAuth;