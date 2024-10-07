import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';  // Importa el hook useLocation
import { connectWebSocketdelay } from '../Services/websocketdelay';

const DelayComponent = () => {
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [messages, setMessages] = useState([]);
  
  // Obtén el token desde el estado de la ubicación
  const location = useLocation();
  const token = location.state?.token;  // Aquí obtienes el token pasado en el estado

  useEffect(() => {
    // Función para manejar los mensajes recibidos
    const handleMessageReceived = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    // Conectar al WebSocket solo si el token está disponible
    if (token) {
      connectWebSocketdelay(token, handleMessageReceived, setConnectionStatus);
    } else {
      setConnectionStatus('No token provided');
    }
  }, [token]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>WebSocket Connection Status: {connectionStatus}</h2>
      
      {connectionStatus === 'Connected' && messages.length > 0 ? (
        <div>
          <h3>Received Messages:</h3>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      ) : connectionStatus === 'Connected' ? (
        <p>No messages received yet.</p>
      ) : null}

      {connectionStatus === 'Error' && (
        <p style={{ color: 'red' }}>Error connecting to WebSocket. Check the console for details.</p>
      )}
    </div>
  );
};

export default DelayComponent;
