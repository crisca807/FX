import React, { createContext, useContext, useEffect, useState } from 'react';
import WebSocketService from '../Services/Websocketservice';
import TokenService from '../Services/Tokenservice';
import { useNavigate } from 'react-router-dom'; // Usa useNavigate en lugar de useHistory

// Crear el contexto de WebSocket
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(() => {
    const savedMessage = sessionStorage.getItem('lastWebSocketMessage');
    return savedMessage ? JSON.parse(savedMessage) : null;
  });

  const navigate = useNavigate(); // Hook de react-router para redirección

  useEffect(() => {
    const connect = async () => {
      try {
        let token = localStorage.getItem('token-socket');
        
        if (!token) {
          console.log('No se encontró el token en localStorage, intentando obtener uno nuevo...');
          token = await TokenService.fetchToken('your-username', 'your-password');
        }

        if (!token) {
          setError('No se encontró un token válido.');
          return;
        }

        localStorage.setItem('token-socket', token);

        await WebSocketService.connect(token);
        WebSocketService.addListener((msg) => {
          setMessage(msg);
          sessionStorage.setItem('lastWebSocketMessage', JSON.stringify(msg));
        });
        setIsConnected(true);
        console.log('Conexión al WebSocket establecida.');
      } catch (err) {
        setError(`Error conectando al WebSocket: ${err.message}`);
        console.error('Error connecting WebSocket:', err);
      }
    };

    connect();

    return () => {
      WebSocketService.disconnect();
      setIsConnected(false);
    };
  }, []);

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token-socket'); // Eliminar el token
    sessionStorage.removeItem('lastWebSocketMessage'); // Eliminar el último mensaje
    setIsConnected(false); // Cambiar el estado de conexión
    setMessage(null); // Limpiar mensaje
    WebSocketService.disconnect(); // Desconectar del WebSocket
    navigate('/'); // Redirigir al home
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, message, error, logout }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook personalizado para acceder al WebSocketContext
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket debe estar dentro de WebSocketProvider');
  }
  return context;
};
