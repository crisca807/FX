import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faArrowTrendUp, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';
import { useWebSocket } from '../../Context/Websocketcontext';
import JSON5 from 'json5';
import '../styles/Trm.css';

const Trm = () => {
  const [data1006, setData1006] = useState(() => {
    // Intentar cargar los datos almacenados en localStorage para el ID 1006
    const storedData = localStorage.getItem('webSocketMessage_1006');
    return storedData ? [JSON.parse(storedData)] : [];
  });
  const { message, error } = useWebSocket();
  const comparisonValue = 4199;

  useEffect(() => {
    if (message) {
      let parsedMessage;
      try {
        parsedMessage = JSON5.parse(message);
      } catch (e) {
        console.error('Error parsing data with JSON5:', e.message);
        parsedMessage = { rawMessage: message };
      }

      // Filtrar solo los datos que corresponden al ID 1006 y mercado 71
      if (parsedMessage?.id === 1006 && parsedMessage?.market === 71) {
        setData1006([parsedMessage]); // Mostrar solo el dato más reciente

        // Almacenar los datos en localStorage para acceso posterior
        localStorage.setItem('webSocketMessage_1006', JSON.stringify(parsedMessage));
      }
    }
  }, [message]);

  const roundValue = (value) => Math.round(parseFloat(value));

  const renderArrowIcon = (value) => {
    if (!value || value === 'Data not available') return null;
    const numericValue = roundValue(value);
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
                <div className="trm-row-title">
                  <div className="circular-icon banco-de-la-republica"></div>
                  <strong className="trm-data-title">TRM:</strong>
                </div>
                <p>
                  {data1006[0].data?.trm || 'Data not available'}
                  <FontAwesomeIcon icon={faCartShopping} style={{ marginLeft: '10px' }} />
                </p>
              </div>
              <div className="trm-data-row">
                <div className="trm-row-title">
                  <div className="circular-icon apertura"></div>
                  <strong className="trm-data-title">Apertura:</strong>
                </div>
                <p>
                  {data1006[0].data?.open || 'Data not available'}
                  {renderArrowIcon(data1006[0].data?.open)}
                </p>
              </div>
              <div className="trm-data-row">
                <div className="trm-row-title">
                  <div className="circular-icon minimo"></div>
                  <strong className="trm-data-title">Mínimo:</strong>
                </div>
                <p>
                  {data1006[0].data?.low || 'Data not available'}
                  {renderArrowIcon(data1006[0].data?.low)}
                </p>
              </div>
              <div className="trm-data-row">
                <div className="trm-row-title">
                  <div className="circular-icon cierre"></div>
                  <strong className="trm-data-title">Máximo:</strong>
                </div>
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

export default Trm;
