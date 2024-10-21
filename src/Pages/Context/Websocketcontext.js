import React, { createContext, useContext, useEffect, useState } from 'react';
import WebSocketService from '../Services/Websocketservice'; // Asegúrate de que esté bien importado
import TokenService from '../Services/Tokenservice'; // Servicio para manejar los tokens

// Crear el contexto de WebSocket
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Manejar la conexión al WebSocket automáticamente al montar
  useEffect(() => {
    const connect = async () => {
      try {
        // Intentar obtener el token desde localStorage o solicitarlo si no está disponible
        let token = localStorage.getItem('token-socket');  // Usando el nuevo nombre de token
        
        // Si no existe el token, obtenerlo a través del servicio de Token
        if (!token) {
          console.log('No se encontró el token en localStorage, intentando obtener uno nuevo...');
          token = await TokenService.fetchToken('your-username', 'your-password'); // Cambia username y password por tus datos
        }

        // Si aún no se tiene token, lanzar un error
        if (!token) {
          setError('No se encontró un token válido.');
          return;
        }

        // Guardar el token en localStorage para futuras conexiones
        localStorage.setItem('token-socket', token);

        // Conectar al WebSocket usando el token
        await WebSocketService.connect(token); // Pasa el token al servicio
        WebSocketService.addListener((msg) => {
          setMessage(msg); // Actualiza el estado con el último mensaje recibido
        });
        setIsConnected(true); // Actualizar el estado de conexión
        console.log('Conexión al WebSocket establecida.');
      } catch (err) {
        setError(`Error conectando al WebSocket: ${err.message}`);
        console.error('Error connecting WebSocket:', err);
      }
    };

    connect(); // Conectar al WebSocket cuando el contexto se monte

    return () => {
      WebSocketService.disconnect(); // Desconectar cuando el proveedor se desmonte
      setIsConnected(false); // Actualizar el estado de conexión
    };
  }, []); // Solo se ejecuta una vez al montar el componente

  return (
    <WebSocketContext.Provider value={{ isConnected, message, error }}>
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
