// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { getToken } from '../Services/axiosconnect'; // Importa la función getToken

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const updateToken = async (username, password) => {
    const result = await getToken(username, password);
    if (result.success) {
      setToken(result.token);
    } else {
      console.error('Failed to update token:', result.error);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
