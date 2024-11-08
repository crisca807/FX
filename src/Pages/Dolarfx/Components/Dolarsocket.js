import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../Context/Websocketcontext';
import JSON5 from 'json5';
import '../styles/Status.css';

const Dolarsocket = () => {
  // Cargar datos almacenados de localStorage en el estado inicial
  const [data1007, setData1007] = useState(() => {
    const storedData = localStorage.getItem('webSocketMessage_1007');
    return storedData ? [JSON.parse(storedData)] : [];
  });
  const { message, error } = useWebSocket();
  const [isBlue, setIsBlue] = useState(false);

  // Cambiar colores cada 3 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsBlue((prevState) => !prevState);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  // Cargar datos en tiempo real si llegan y almacenarlos
  useEffect(() => {
    if (message) {
      let parsedMessage;
      try {
        parsedMessage = JSON5.parse(message);
      } catch (e) {
        console.error('Error parsing data with JSON5:', e.message);
        return;
      }

      // Verificar ID y mercado
      if (parsedMessage?.id === 1007 && parsedMessage?.market === 71) {
        setData1007((prevData) => {
          const newData = [parsedMessage, ...prevData].slice(0, 30); // Solo mantener los últimos 30 elementos
          localStorage.setItem('webSocketMessage_1007', JSON.stringify(parsedMessage));
          return newData;
        });
      }
    }
  }, [message]);

  // Efecto para verificar y cargar datos almacenados en localStorage cada 2 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedData = localStorage.getItem('webSocketMessage_1007');
      if (storedData) {
        const parsedStoredData = JSON.parse(storedData);
        // Comprobar si los datos almacenados han cambiado
        setData1007((prevData) => {
          if (!prevData.length || prevData[0]?.data?.avg !== parsedStoredData.data?.avg || prevData[0]?.data?.close !== parsedStoredData.data?.close) {
            return [parsedStoredData, ...prevData].slice(0, 30);
          }
          return prevData;
        });
      }
    }, 2000); // Revisar cada 2 segundos

    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
  }, []);

  const renderData = (item) => {
    if (!item) return <p>No data available</p>;

    const avg = item.data?.avg || 'Data not available';
    const close = item.data?.close || 'Data not available';

    return (
      <div className="data-container">
        <div className={`datadolar-box close-box ${isBlue ? 'blue-color' : ''}`}>
          <h2>Cierre</h2>
          <p>{close}</p>
        </div>
        <div className={`datadolar-box avg-box ${isBlue ? 'blue-color' : ''}`}>
          <h2>Promedio</h2>
          <p>{avg}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="dolar-info-time">
      <h1 className="market-title">Resumen del Mercado</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {data1007.length > 0 ? renderData(data1007[0]) : <p>No se recibieron datos para el ID 1007 y market 71.</p>}
      </div>
    </div>
  );
};

export default Dolarsocket;
