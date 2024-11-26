import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import WebSocketServiceDelay from '../Services/websocketdelay'; // Importa la instancia

// Crear el contexto
const WebSocketContextDelay = createContext(null);

export const WebSocketProviderDelay = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const isConnectingRef = useRef(false); // Marca para evitar conexiones duplicadas

  useEffect(() => {
    const connect = async () => {
      if (isConnectingRef.current) {
        console.log('Ya se está intentando conectar. Evitando conexión duplicada.');
        return;
      }
      isConnectingRef.current = true; // Marcar que se está intentando conectar
      setLoading(true);

      // Obtener el token del localStorage
      let token = localStorage.getItem('token');
      let retries = 0;

      // Reintentar obtener el token si no está disponible
      while (!token && retries < 5) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Espera 1 segundo
        token = localStorage.getItem('token');
        retries++;
      }

      if (!token) {
        setError('No se encontró un token válido después de varios intentos.');
        setLoading(false); // Finalizar la carga
        isConnectingRef.current = false; // Liberar el intento de conexión
        return;
      }

      try {
        // Conectar al WebSocket
        await WebSocketServiceDelay.connect();
        WebSocketServiceDelay.addListener((msg) => {
          const { id } = msg;

          // Verificar que el id está entre 1000 y 1007
          if (id >= 1000 && id <= 1007) {
            // Guardar cada mensaje en localStorage con el prefijo 'delay_' y el ID correspondiente
            localStorage.setItem(`delay_${id}`, JSON.stringify(msg));
          }

          // Actualizar el estado con el mensaje recibido
          setMessage(msg);
        });
        setIsConnected(true); // Actualizar el estado de conexión
        localStorage.setItem('isConnected', JSON.stringify(true)); // Guardar el estado de conexión en localStorage
      } catch (err) {
        setError(`Error conectando al WebSocket: ${err.message}`);
        console.error('Error conectando al WebSocket:', err);
      } finally {
        setLoading(false); // Finalizar la carga
        isConnectingRef.current = false; // Liberar el intento de conexión
      }
    };

    connect(); // Conectar al WebSocket al montar el contexto

    // Desconectar y limpiar datos al desmontar el contexto
    return () => {
      WebSocketServiceDelay.disconnect(); // Desconectar al desmontar el contexto
      setIsConnected(false); // Limpiar el estado de la conexión
      localStorage.removeItem('isConnected'); // Eliminar el estado de conexión de localStorage
    };
  }, []);

  // Recuperar datos de localStorage si se pierde la conexión
  useEffect(() => {
    if (!isConnected && localStorage.getItem('isConnected')) {
      setIsConnected(JSON.parse(localStorage.getItem('isConnected')));
    }
    if (!message) {
      // Recuperar el último mensaje recibido para cada ID entre 1000 y 1007
      const storedMessages = [];
      for (let id = 1000; id <= 1007; id++) {
        const storedMessage = localStorage.getItem(`delay_${id}`);
        if (storedMessage) {
          storedMessages.push(JSON.parse(storedMessage));
        }
      }
      if (storedMessages.length > 0) {
        setMessage(storedMessages[storedMessages.length - 1]); // Establecer el último mensaje en el estado
      }
    }
  }, [isConnected, message]);

  // Si está en estado de carga, mostrar un mensaje
  if (loading) {
    return <div>Cargando conexión al WebSocket...</div>;
  }

  return (
    <WebSocketContextDelay.Provider value={{ isConnected, message, error }}>
      {children}
    </WebSocketContextDelay.Provider>
  );
};

// Hook personalizado para acceder al WebSocketContextDelay
export const useWebSocketDelay = () => {
  const context = useContext(WebSocketContextDelay);
  if (!context) {
    throw new Error('useWebSocketDelay debe estar dentro de WebSocketProviderDelay');
  }
  return context;
};
