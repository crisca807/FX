import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../Context/Websocketcontext'; // Importa el contexto de WebSocket
import JSON5 from 'json5';
import '../styles/mount.css'; // Importa el archivo CSS actualizado

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBusinessTime, faList, faChartSimple, faArrowDown, faArrowUp, faCashRegister } from '@fortawesome/free-solid-svg-icons'; // Importar los íconos

const Mount = () => {
  const [data1005, setData1005] = useState([]);
  const { isConnected, message, error } = useWebSocket(); // Usar el contexto de WebSocket

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

  // Tomar solo el último dato más reciente
  const latestData = data1005.length > 0 ? data1005[0] : null;

  return (
    <div className="unique-dolar-info">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {latestData ? (
          <>
            <h2 className="table-title">Montos USD</h2> {/* Agrega el título */}
            <div className="unique-data-table">
              <div className="unique-data-row">
                <FontAwesomeIcon icon={faBusinessTime} className="icon" /> {/* Ícono negociado */}
                <span className="unique-data-item-title">Negociado:</span>
                <span className="unique-data-item-value">{latestData.data?.sum || 'Data not available'}</span>
              </div>
              <div className="unique-data-row">
                <FontAwesomeIcon icon={faList} className="icon" /> {/* Ícono último */}
                <span className="unique-data-item-title">Último:</span>
                <span className="unique-data-item-value">{latestData.data?.open || 'Data not available'}</span>
              </div>
              <div className="unique-data-row">
                <FontAwesomeIcon icon={faChartSimple} className="icon" /> {/* Ícono promedio */}
                <span className="unique-data-item-title">Promedio:</span>
                <span className="unique-data-item-value">{latestData.data?.avg || 'Data not available'}</span>
              </div>
              <div className="unique-data-row">
                <FontAwesomeIcon icon={faArrowDown} className="icon" /> {/* Ícono mínimo */}
                <span className="unique-data-item-title">Mínimo:</span>
                <span className="unique-data-item-value">{latestData.data?.low || 'Data not available'}</span>
              </div>
              <div className="unique-data-row">
                <FontAwesomeIcon icon={faArrowUp} className="icon" /> {/* Ícono máximo */}
                <span className="unique-data-item-title">Máximo:</span>
                <span className="unique-data-item-value">{latestData.data?.high || 'Data not available'}</span>
              </div>
              <div className="unique-data-row">
                <FontAwesomeIcon icon={faCashRegister} className="icon" /> {/* Ícono transacciones */}
                <span className="unique-data-item-title">Transacciones:</span>
                <span className="unique-data-item-value">{latestData.data?.count || 'Data not available'}</span>
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
