import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import WebSocketService from '../Services/Websocketservice';
import TokenService from '../Services/Tokenservice';
import { useNavigate } from 'react-router-dom';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(() => {
    const savedMessage = sessionStorage.getItem('lastWebSocketMessage');
    return savedMessage ? JSON.parse(savedMessage) : null;
  });
  const wsConnectionRef = useRef(null); // Usar useRef para almacenar la conexión

  const navigate = useNavigate();

  useEffect(() => {
    const connect = async () => {
      if (wsConnectionRef.current) {
        // Si ya hay una conexión activa, salir de la función
        return;
      }

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

        // Conectar al WebSocket usando el token y guardar en la referencia
        wsConnectionRef.current = await WebSocketService.connect(token);
        
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
      // Desconectar y limpiar la referencia al desmontar
      if (wsConnectionRef.current) {
        WebSocketService.disconnect();
        wsConnectionRef.current = null;
      }
      setIsConnected(false);
    };
  }, []);

  // Función para cerrar sesión y desconectar WebSocket
  const logout = () => {
    localStorage.removeItem('token-socket');
    sessionStorage.removeItem('lastWebSocketMessage');
    
    if (wsConnectionRef.current) {
      WebSocketService.disconnect();
      wsConnectionRef.current = null;
    }

    setIsConnected(false);
    setMessage(null);
    navigate('/');
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
