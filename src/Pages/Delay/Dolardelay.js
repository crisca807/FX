import React, { useEffect, useState } from 'react';
import { useWebSocketDelay } from '../Context/WebSocketContextDelay';
import JSON5 from 'json5';
import '../Delay/Styles/dolar.css';

const Dolardelay = () => {
  const [data1007, setData1007] = useState([]);
  const { message, error } = useWebSocketDelay();

  useEffect(() => {
    if (message) {
      console.log('Received message in component:', message);

      let parsedMessage;
      try {
        parsedMessage = JSON5.parse(message);
      } catch (e) {
        console.error('Error parsing data with JSON5:', e.message);
        return;
      }

      // Validar ID, market y datos relevantes
      if (
        parsedMessage?.id === 1007 &&
        parsedMessage?.market === 71 &&
        parsedMessage?.data?.avg &&
        parsedMessage?.data?.close
      ) {
        const isDuplicate = data1007.some(
          (item) =>
            item.data.avg === parsedMessage.data.avg &&
            item.data.close === parsedMessage.data.close
        );

        if (!isDuplicate) {
          setData1007((prevData) => {
            const newData = [...prevData, parsedMessage];
            return newData.slice(-30); // Mantener solo los últimos 30 elementos
          });
          console.log('Updated data for ID 1007 and market 71:', parsedMessage);
        }
      }
    }
  }, [message, data1007]);

  const renderData = (item) => {
    if (!item) return <p>No data available</p>;

    const avg = item.data?.avg || 'Data not available';
    const close = item.data?.close || 'Data not available';

    return (
      <div className="infoprom-delay-data-container">
        <div className="infoprom-delay-datadolar-box infoprom-delay-avg-box">
          <h2>Promedio</h2>
          <p>{avg}</p>
        </div>
        <div className="infoprom-delay-datadolar-box infoprom-delay-close-box">
          <h2>Cierre</h2>
          <p>{close}</p>
        </div>
      </div>
    );
  };

  const sortedData = [...data1007].sort(
    (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
  );

  return (
    <div className="infoprom-delay-dolar-info">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {sortedData.length > 0 ? (
          renderData(sortedData[0]) // Mostrar solo el elemento más reciente
        ) : (
          <p>No data received for ID 1007 and market 71.</p>
        )}
      </div>
    </div>
  );
};

export default Dolardelay;
