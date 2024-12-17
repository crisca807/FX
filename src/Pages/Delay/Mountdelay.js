import React, { useEffect, useState } from 'react';
import { useWebSocketDelay } from '../../Pages/Context/WebSocketContextDelay'; // Importa el contexto de WebSocket
import JSON5 from 'json5';
import '../Delay/Styles/Mountdelay.css'; // Importa el archivo CSS actualizado

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBusinessTime,
  faList,
  faChartSimple,
  faArrowDown,
  faArrowUp,
  faCashRegister,
} from '@fortawesome/free-solid-svg-icons';

const MountDelay = () => {
  const [latestData, setLatestData] = useState(null);
  const { message, error } = useWebSocketDelay(); // Usar el contexto de WebSocket

  // Actualiza el estado inmediatamente al recibir un nuevo mensaje
  useEffect(() => {
    if (message) {
      console.log('Mensaje recibido en el componente:', message);

      try {
        const parsedMessage = JSON5.parse(message);

        // Filtrar solo datos del market 71 y id 1005
        if (parsedMessage?.id === 1005 && parsedMessage?.market === 71) {
          setLatestData(parsedMessage); // Actualiza inmediatamente
        }
      } catch (e) {
        console.error('Error al parsear datos con JSON5:', e.message);
      }
    }
  }, [message]);

  return (
    <div className="unique-dolar-info">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {latestData ? (
          <>
            <h2 className="table-title">Montos USD</h2>
            <div className="unique-data-table">
              <div className="unique-data-row">
                <FontAwesomeIcon icon={faBusinessTime} className="icon" />
                <span className="unique-data-item-title">Negociado:</span>
                <span className="unique-data-item-value">
                  {latestData.data?.sum || 'Data not available'}
                </span>
              </div>
              <div className="unique-data-row">
                <FontAwesomeIcon icon={faList} className="icon" />
                <span className="unique-data-item-title">Último:</span>
                <span className="unique-data-item-value">
                  {latestData.data?.open || 'Data not available'}
                </span>
              </div>
              <div className="unique-data-row">
                <FontAwesomeIcon icon={faChartSimple} className="icon" />
                <span className="unique-data-item-title">Promedio:</span>
                <span className="unique-data-item-value">
                  {latestData.data?.avg || 'Data not available'}
                </span>
              </div>
              <div className="unique-data-row">
                <FontAwesomeIcon icon={faArrowDown} className="icon" />
                <span className="unique-data-item-title">Mínimo:</span>
                <span className="unique-data-item-value">
                  {latestData.data?.low || 'Data not available'}
                </span>
              </div>
              <div className="unique-data-row">
                <FontAwesomeIcon icon={faArrowUp} className="icon" />
                <span className="unique-data-item-title">Máximo:</span>
                <span className="unique-data-item-value">
                  {latestData.data?.high || 'Data not available'}
                </span>
              </div>
              <div className="unique-data-row">
                <FontAwesomeIcon icon={faCashRegister} className="icon" />
                <span className="unique-data-item-title">Transacciones:</span>
                <span className="unique-data-item-value">
                  {latestData.data?.count || 'Data not available'}
                </span>
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

export default MountDelay;
