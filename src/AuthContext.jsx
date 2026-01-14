import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const apiUrl = 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data if logged in
  const [loading, setLoading] = useState(true); // Indicates if auth status is being checked

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('checking auth status', loading);

      const storedUser = localStorage.getItem('auth');
      let currentUser = null;
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
        setUser(currentUser);
      }

      if (!currentUser || !currentUser.access_token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch(apiUrl + '/api/users/current', {
        headers: {
          Authorization: 'Bearer ' + currentUser.access_token,
        },
      });
      const data = await response.json();

      console.log('me', data);

      if (data.status === 'ok') {
        console.log('Setting Current user', currentUser);
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const payload = {};
      payload.identifier = credentials.username;
      payload.password = credentials.password;
      payload.type = credentials.type;

      const response = await fetch(apiUrl + '/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok || !data.data || !data.data.access_token) {
        throw new Error(data.message || 'Login failed');
      }

      // Store complete auth data with token
      const authData = {
        ...data.data,
        access_token: data.data.access_token,
      };

      setUser(authData);
      localStorage.setItem('auth', JSON.stringify(authData));

      return authData;
    } catch (e) {
      console.error('Login error:', e);
      throw new Error(e.message || 'Login failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
