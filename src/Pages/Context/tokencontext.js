import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '../Services/axiosconnect'; // Importa la función getToken

// Crea el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token-socket') || null); // Intentar cargar el token desde localStorage si ya existe

  // Función para actualizar el token usando la función getToken
  const updateToken = async (username, password) => {
    const result = await getToken(username, password);
    if (result.success) {
      setToken(result.token);
      localStorage.setItem('token-socket', result.token); // Guardar el token en localStorage con el nombre 'token-socket'
    } else {
      console.error('Failed to update token:', result.error);
      setToken(null);
      localStorage.removeItem('token-socket'); // Limpiar el token del localStorage si falla
    }
  };

  // Si ya existe un token en localStorage, establecerlo en el estado
  useEffect(() => {
    const savedToken = localStorage.getItem('token-socket');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Función para limpiar el token (en caso de logout o expiración)
  const clearToken = () => {
    setToken(null);
    localStorage.removeItem('token-socket'); // Elimina el token del localStorage
  };

  return (
    <AuthContext.Provider value={{ token, updateToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Exporta el AuthContext en caso de que se necesite acceder al contexto directamente
export default AuthContext;
