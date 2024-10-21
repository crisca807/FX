import React, { createContext, useContext, useEffect, useState } from 'react';
import WebSocketServiceDelay from '../Services/websocketdelay';

const WebSocketContextDelay = createContext(null);

export const WebSocketProviderDelay = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const connect = async () => {
      try {
        // Verificar si ya estamos conectados para evitar conexiones múltiples
        if (!WebSocketServiceDelay.isConnected) {
          console.log('Conectando al WebSocket...');
          await WebSocketServiceDelay.connect(); // Conectar usando el token
        }

        // Escuchar los mensajes del WebSocket
        WebSocketServiceDelay.addListener((msg) => {
          setMessage(msg);
        });

        setIsConnected(true);
      } catch (err) {
        console.error('Error conectando al WebSocket:', err);
        setError(`Error conectando al WebSocket: ${err.message}`);
      }
    };

    connect(); // Conectar al WebSocket cuando el proveedor se monte

    return () => {
      WebSocketServiceDelay.disconnect(); // Desconectar cuando el proveedor se desmonte
      setIsConnected(false);
    };
  }, []);

  return (
    <WebSocketContextDelay.Provider value={{ isConnected, message, error }}>
      {children}
    </WebSocketContextDelay.Provider>
  );
};

export const useWebSocketDelay = () => {
  const context = useContext(WebSocketContextDelay);
  if (!context) {
    throw new Error('useWebSocketDelay debe estar dentro de WebSocketProviderDelay');
  }
  return context;
};
