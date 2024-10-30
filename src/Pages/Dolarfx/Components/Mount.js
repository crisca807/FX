import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../Context/Websocketcontext';
import JSON5 from 'json5';
import '../styles/mount.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBusinessTime, faList, faChartSimple, faArrowDown, faArrowUp, faCashRegister } from '@fortawesome/free-solid-svg-icons';

const Mount = () => {
  const [data1005, setData1005] = useState([]);
  const { isConnected, message, error } = useWebSocket();

  useEffect(() => {
    if (message) {
      console.log('Mensaje recibido en el componente:', message);

      let parsedMessage;
      try {
        parsedMessage = JSON5.parse(message);
      } catch (e) {
        console.error('Error al parsear datos con JSON5:', e.message);
        parsedMessage = { rawMessage: message };
      }

      // Filtrar solo datos del market 71
      if (parsedMessage?.id === 1005 && parsedMessage?.market === 71) {
        setData1005((prevData) => {
          const newData = [...prevData, parsedMessage];
          return newData.slice(-20); // Mantener solo los últimos 20 elementos
        });
        console.log('Datos actualizados para ID 1005 y market 71:', parsedMessage);
      }
    }
  }, [message]);

  useEffect(() => {
    // Refrescar la lista cada 5 segundos
    const intervalId = setInterval(() => {
      setData1005((prevData) => [...prevData]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [data1005]);

  const latestData = data1005.length > 0 ? data1005[0] : null;

  return (
    <div className="MountDolar-container">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {latestData ? (
          <>
            <h2 className="MountDolar-table-title">Montos USD</h2>
            <div className="MountDolar-data-table">
              <div className="MountDolar-data-row">
                <FontAwesomeIcon icon={faBusinessTime} className="MountDolar-icon" />
                <span className="MountDolar-data-item-title">Negociado:</span>
                <span className="MountDolar-data-item-value">{latestData.data?.sum || 'Data not available'}</span>
              </div>
              <div className="MountDolar-data-row">
                <FontAwesomeIcon icon={faList} className="MountDolar-icon" />
                <span className="MountDolar-data-item-title">Último:</span>
                <span className="MountDolar-data-item-value">{latestData.data?.open || 'Data not available'}</span>
              </div>
              <div className="MountDolar-data-row">
                <FontAwesomeIcon icon={faChartSimple} className="MountDolar-icon" />
                <span className="MountDolar-data-item-title">Promedio:</span>
                <span className="MountDolar-data-item-value">{latestData.data?.avg || 'Data not available'}</span>
              </div>
              <div className="MountDolar-data-row">
                <FontAwesomeIcon icon={faArrowDown} className="MountDolar-icon" />
                <span className="MountDolar-data-item-title">Mínimo:</span>
                <span className="MountDolar-data-item-value">{latestData.data?.low || 'Data not available'}</span>
              </div>
              <div className="MountDolar-data-row">
                <FontAwesomeIcon icon={faArrowUp} className="MountDolar-icon" />
                <span className="MountDolar-data-item-title">Máximo:</span>
                <span className="MountDolar-data-item-value">{latestData.data?.high || 'Data not available'}</span>
              </div>
              <div className="MountDolar-data-row">
                <FontAwesomeIcon icon={faCashRegister} className="MountDolar-icon" />
                <span className="MountDolar-data-item-title">Transacciones:</span>
                <span className="MountDolar-data-item-value">{latestData.data?.count || 'Data not available'}</span>
              </div>
            </div>
          </>
        ) : (
          <p>No se recibieron datos para el ID 1005 y market 71.</p>
        )}
      </div>
    </div>
  );
};

export default Mount;
