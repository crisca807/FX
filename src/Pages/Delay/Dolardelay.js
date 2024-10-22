import React, { useEffect, useState } from 'react';
import { useWebSocketDelay } from '../Context/WebSocketContextDelay'; // Importar el contexto de WebSocket
import JSON5 from 'json5';
import '../Dolarfx/styles/Status.css'; // Importar el archivo CSS

const Dolardelay = () => {
  const [data1007, setData1007] = useState([]);
  const { message, error } = useWebSocketDelay(); // Usar solo el mensaje y el error del contexto

  useEffect(() => {
    if (message) {
      console.log('Received message in component:', message);

      let parsedMessage;
      try {
        parsedMessage = JSON5.parse(message);
      } catch (e) {
        console.error('Error parsing data with JSON5:', e.message);
        parsedMessage = { rawMessage: message };
      }

      // Verificar que el ID es 1007 y que el market es 71
      if (parsedMessage?.id === 1007 && parsedMessage?.market === 71) {
        const existingData = data1007.find(
          (item) => item.data.avg === parsedMessage.data.avg && item.data.close === parsedMessage.data.close
        );
        if (!existingData) {
          setData1007((prevData) => {
            const newData = [...prevData, parsedMessage];
            return newData.slice(-30); // Mantener solo los últimos 30 elementos
          });
          console.log('Updated data for ID 1007 and market 71:', parsedMessage);
        }
      }
    }
  }, [message, data1007]);

  useEffect(() => {
    // Refrescar la lista cada 5 segundos
    const intervalId = setInterval(() => {
      setData1007((prevData) => [...prevData]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [data1007]);

  const renderData = (item) => {
    if (!item) return <p>No data available</p>;

    // Acceder directamente a los datos sin formatear
    const avg = item.data?.avg || 'Data not available';
    const close = item.data?.close || 'Data not available';

    return (
      <div className="data-container">
        <div className="datadolar-box avg-box">
          <h2>Promedio</h2>
          <p>{avg}</p>
        </div>
        <div className="datadolar-box close-box">
          <h2>Cierre</h2>
          <p>{close}</p>
        </div>
      </div>
    );
  };

  // Ordenar los datos por timestamp en orden descendente (más recientes primero)
  const sortedData = data1007.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="dolar-info">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {sortedData.length > 0 ? (
          renderData(sortedData[0]) // Mostrar solo el último elemento
        ) : (
          <p>No data received for ID 1007 and market 71.</p>
        )}
      </div>
    </div>
  );
};

export default Dolardelay;
