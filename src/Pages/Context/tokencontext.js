// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { getToken } from '../Services/axiosconnect'; // Importa la función getToken

// Crea el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Función para actualizar el token usando la función getToken
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

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Exporta el AuthContext en caso de que se necesite acceder al contexto directamente
export default AuthContext;
