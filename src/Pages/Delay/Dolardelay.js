import React, { useEffect, useState } from 'react';
import { useWebSocketDelay } from '../Context/WebSocketContextDelay';
import JSON5 from 'json5';
import '../Delay/Styles/dolar.css';

const Dolardelay = () => {
  const [data1007, setData1007] = useState([]);
  const [latestData, setLatestData] = useState(null); // Estado para almacenar el dato más reciente
  const { message, error } = useWebSocketDelay();

  const isDifferentData = (prevItem, newItem) => {
    if (!prevItem || !newItem) return true; 
    const keysToCompare = ['avg', 'close', 'timestamp'];
    return keysToCompare.some(
      (key) => prevItem?.data[key] !== newItem?.data[key]
    );
  };

  useEffect(() => {
    if (message) {
      console.log('Mensaje recibido en el componente:', message);

      let parsedMessage;
      try {
        parsedMessage = JSON5.parse(message);
      } catch (e) {
        console.error('Error al parsear el mensaje JSON5:', e.message);
        return;
      }

      if (
        parsedMessage?.id === 1007 &&
        parsedMessage?.market === 71 &&
        parsedMessage?.data?.avg !== undefined &&
        parsedMessage?.data?.close !== undefined
      ) {
        setData1007((prevData) => {
          const latestData = prevData[prevData.length - 1];
          if (isDifferentData(latestData, parsedMessage)) {
            const updatedData = [...prevData, parsedMessage].slice(-30); // Mantener solo los últimos 30
            setLatestData(parsedMessage); // Actualizar el dato más reciente
            console.log('Datos actualizados para ID 1007:', updatedData);
            return updatedData;
          }
          return prevData;
        });
      }
    }
  }, [message]);

  const renderData = (item) => {
    if (!item) return <p>No hay datos disponibles</p>;

    const avg = item.data?.avg || 'Datos no disponibles';
    const close = item.data?.close || 'Datos no disponibles';

    return (
     
      <div className="infoprom-delay-data-container">
      <div className="infoprom-delay-datadolar-box infoprom-delay-close-box">
        <h2>Cierre</h2>
        <p>{close}</p>
      </div>
      <div className="infoprom-delay-datadolar-box infoprom-delay-avg-box">
        <h2>Promedio</h2>
        <p>{avg}</p>
      </div>
    </div>
    );
  };

  return (
    <div className="infoprom-delay-dolar-info">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {latestData ? (
          renderData(latestData) // Mostrar el dato más reciente
        ) : (
          <p>No se han recibido datos para ID 1007 y mercado 71.</p>
        )}
      </div>
    </div>
  );
};

export default Dolardelay;
