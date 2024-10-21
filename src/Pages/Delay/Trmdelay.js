import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faArrowTrendUp, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';
import { useWebSocketDelay } from '../Context/WebSocketContextDelay'; // Importa el contexto de WebSocket
import JSON5 from 'json5'; // Importa JSON5 para manejar el parseo de mensajes
import '../../Pages/Delay/Styles/Trmdelay.css'; // Asegúrate de que este archivo CSS esté actualizado

const TrmDelay = () => {
  const [data1006, setData1006] = useState([]);
  const { message, error } = useWebSocketDelay(); // Usar el contexto de WebSocket
  const comparisonValue = 4199; // Valor fijo para la comparación

  useEffect(() => {
    if (message) {
      let parsedMessage;
      try {
        parsedMessage = JSON5.parse(message);
      } catch (e) {
        console.error('Error parsing data with JSON5:', e.message);
        parsedMessage = { rawMessage: message };
      }

      // Filtrar solo datos del market 71 y ID 1006
      if (parsedMessage?.id === 1006 && parsedMessage?.market === 71) {
        setData1006((prevData) => {
          const newData = [...prevData, parsedMessage];
          return newData.slice(-2); // Mantener los últimos dos elementos para comparación
        });
      }
    }
  }, [message]);

  useEffect(() => {
    // Refrescar la lista cada 5 segundos
    const intervalId = setInterval(() => {
      setData1006((prevData) => [...prevData]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [data1006]);

  // Función para redondear el valor antes de la comparación
  const roundValue = (value) => {
    return Math.round(parseFloat(value));
  };

  // Función para determinar el color y la dirección de la flecha
  const renderArrowIcon = (value) => {
    if (!value || value === 'Data not available') return null;
    const numericValue = roundValue(value); // Redondear el valor
    if (numericValue > comparisonValue) {
      return <FontAwesomeIcon icon={faArrowTrendUp} style={{ color: 'green', marginLeft: '10px' }} />;
    } else if (numericValue < comparisonValue) {
      return <FontAwesomeIcon icon={faArrowTrendDown} style={{ color: 'red', marginLeft: '10px' }} />;
    }
    return null;
  };

  return (
    <div className="trm-dolar-info">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {data1006.length > 0 ? (
          <div className="trm-table-container">
            <h1 className="trm-table-title">Precios del dólar</h1>
            <div className="trm-data-table">
              <div className="trm-data-row">
                <strong>TRM:</strong>
                <p>
                  {data1006[0].data?.trm || 'Data not available'}
                  <FontAwesomeIcon icon={faCartShopping} style={{ marginLeft: '10px' }} />
                </p>
              </div>
              <div className="trm-data-row">
                <strong>Apertura:</strong>
                <p>
                  {data1006[0].data?.open || 'Data not available'}
                  {renderArrowIcon(data1006[0].data?.open)}
                </p>
              </div>
              <div className="trm-data-row">
                <strong>Mínimo:</strong>
                <p>
                  {data1006[0].data?.low || 'Data not available'}
                  {renderArrowIcon(data1006[0].data?.low)}
                </p>
              </div>
              <div className="trm-data-row">
                <strong>Máximo:</strong>
                <p>
                  {data1006[0].data?.high || 'Data not available'}
                  {renderArrowIcon(data1006[0].data?.high)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>No se recibieron datos para el ID 1006 y el mercado 71.</p>
        )}
      </div>
    </div>
  );
};

export default TrmDelay;
