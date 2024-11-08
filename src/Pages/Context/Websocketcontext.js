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
  const wsConnectionRef = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const connect = async () => {
    if (wsConnectionRef.current) {
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

      wsConnectionRef.current = await WebSocketService.connect(token);

      WebSocketService.addListener((msg) => {
        const parsedMessage = JSON.parse(msg);
        const { id, market } = parsedMessage;

        // Filtrar solo mensajes con id entre 1000 y 1007 y con market igual a 71
        if (id >= 1000 && id <= 1007 && market === 71) {
          setMessage(msg);
          sessionStorage.setItem('lastWebSocketMessage', JSON.stringify(msg));
          localStorage.setItem('backupWebSocketMessage', JSON.stringify(msg));

          // Almacenar mensajes individualmente por ID (del 1000 al 1007)
          localStorage.setItem(`webSocketMessage_${id}`, JSON.stringify(parsedMessage));
        }

        // Reiniciar el temporizador de timeout cada vez que llega un nuevo mensaje
        resetTimeout();
      });

      setIsConnected(true);
      console.log('Conexión al WebSocket establecida.');
      resetTimeout();
    } catch (err) {
      setError(`Error conectando al WebSocket: ${err.message}`);
      console.error('Error connecting WebSocket:', err);
      backupDataHandler();
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (wsConnectionRef.current) {
        WebSocketService.disconnect();
        wsConnectionRef.current = null;
      }
      clearTimeout(timeoutRef.current);
      setIsConnected(false);
    };
  }, []);

  // Function to use backup data if the connection is lost
  const backupDataHandler = () => {
    const backupData = {};
    for (let id = 1000; id <= 1007; id++) {
      const savedMessage = localStorage.getItem(`webSocketMessage_${id}`);
      if (savedMessage) {
        backupData[id] = JSON.parse(savedMessage);
      }
    }
    setMessage(backupData);
;
    console.log('Usando datos de backup de localStorage');
  };

  // Function to reset the timeout for detecting no data received
  const resetTimeout = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.log('No se han recibido datos recientes. Usando datos de backup.');
      backupDataHandler();
    }, 10000); // Wait 10 seconds before using backup data
  };

  // Función para obtener datos almacenados por ID
  const getStoredDataForId = (id) => {
    const savedMessage = localStorage.getItem(`webSocketMessage_${id}`);
    return savedMessage ? JSON.parse(savedMessage) : null;
  };

  const logout = () => {
    localStorage.removeItem('token-socket');
    sessionStorage.removeItem('lastWebSocketMessage');
    localStorage.removeItem('backupWebSocketMessage');

    // Remove specific messages for IDs 1000 to 1007 from localStorage
    for (let id = 1000; id <= 1007; id++) {
      localStorage.removeItem(`webSocketMessage_${id}`);
    }

    if (wsConnectionRef.current) {
      WebSocketService.disconnect();
      wsConnectionRef.current = null;
    }

    setIsConnected(false);
    setMessage(null);
    navigate('/');
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, message, error, logout, getStoredDataForId }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook to access the WebSocketContext
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket debe estar dentro de WebSocketProvider');
  }
  return context;
};
