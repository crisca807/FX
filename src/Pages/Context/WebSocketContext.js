// src/contexts/WebSocketContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Importa useLocation
import { connectWebSocket } from '../Services/Websocketservice'; // Asegúrate de que la ruta sea correcta
import JSON5 from 'json5'; // Importa JSON5

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const location = useLocation(); // Usa useLocation para obtener el estado de navegación
  const [status, setStatus] = useState('Checking connection...');
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState({}); // Estado para almacenar datos agrupados por categoría

  useEffect(() => {
    const checkConnection = async () => {
      if (location.state?.token) {
        const accessToken = location.state.token;
        setToken(accessToken);
        setStatus('Connection successful!');

        try {
          await connectWebSocket(accessToken, (message) => {
            console.log('Received message in context:', message);

            let parsedMessage;
            try {
              parsedMessage = JSON5.parse(message);
            } catch (e) {
              console.error('Error parsing data with JSON5:', e.message);
              parsedMessage = message;
            }

            setData(prevData => {
              const updatedData = { ...prevData };
              if (parsedMessage.message) {
                updatedData[parsedMessage.message] = parsedMessage;
              }
              console.log('Updated data in context:', updatedData);
              return updatedData;
            });
          });

        } catch (err) {
          setStatus('Connection failed');
          setError('An error occurred: ' + err.message);
        }
      } else {
        setStatus('No token provided');
      }
    };

    checkConnection();
  }, [location.state?.token]); // Re-ejecutar el efecto si el token cambia

  return (
    <WebSocketContext.Provider value={{ status, token, error, data }}>
      {children}
    </WebSocketContext.Provider>
  );
};
