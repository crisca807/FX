import React, { useEffect, useState } from 'react';
import { useWebSocketDelay } from '../Context/WebSocketContextDelay'; // Hook para WebSocket

const SpotDelay = () => {
  const { isConnected, message, error } = useWebSocketDelay(); // Usamos el hook para acceder a la conexión y mensajes
  const [filteredMessage, setFilteredMessage] = useState(null); // Estado para almacenar solo el último mensaje filtrado

  // Filtrar solo el último mensaje con id 1000 y market 71
  useEffect(() => {
    if (message) {
      try {
        const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message; // Verificar si el mensaje es un string o ya es un objeto

        // Filtrar por id y market
        if (parsedMessage.id === 1000 && parsedMessage.market === 71) {
          setFilteredMessage(parsedMessage); // Actualizar el estado con el último mensaje
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    }
  }, [message]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>WebSocket Connection Status: {isConnected ? 'Connected' : 'Connecting...'}</h2>

      {/* Mostrar el último mensaje filtrado si hay una conexión */}
      {isConnected && filteredMessage ? (
        <div>
          <h3>Last Filtered Message (id: 1000, market: 71):</h3>
          <p>
            <strong>ID:</strong> {filteredMessage.id}, <strong>Market:</strong> {filteredMessage.market}, <strong>Data:</strong> {JSON.stringify(filteredMessage.data)}
          </p>
        </div>
      ) : isConnected ? (
        <p>No filtered message received yet.</p>
      ) : null}

      {error && (
        <p style={{ color: 'red' }}>Error connecting to WebSocket: {error}</p>
      )}
    </div>
  );
};

export default SpotDelay;
