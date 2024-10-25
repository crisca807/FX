import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faArrowTrendUp, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';
import { useWebSocketDelay } from '../Context/WebSocketContextDelay';
import JSON5 from 'json5'; 
import '../../Pages/Dolarfx/styles/Trm.css';

const TrmDelay = () => {
  const [data1006, setData1006] = useState([]);
  const { message, error } = useWebSocketDelay();
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

      if (parsedMessage?.id === 1006 && parsedMessage?.market === 71) {
        setData1006((prevData) => {
          const newData = [...prevData, parsedMessage];
          return newData.slice(-2);
        });
      }
    }
  }, [message]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setData1006((prevData) => [...prevData]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [data1006]);

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
                <div className="circular-icon banco-de-la-republica"></div> {/* Fondo desde CSS */}
                <strong>TRM:</strong>
                <p>
                  {data1006[0].data?.trm || 'Data not available'}
                  <FontAwesomeIcon icon={faCartShopping} style={{ marginLeft: '10px' }} />
                </p>
              </div>
              <div className="trm-data-row">
                <div className="circular-icon apertura"></div> {/* Fondo desde CSS */}
                <strong>Apertura:</strong>
                <p>
                  {data1006[0].data?.open || 'Data not available'}
                  {renderArrowIcon(data1006[0].data?.open)}
                </p>
              </div>
              <div className="trm-data-row">
                <div className="circular-icon minimo"></div> {/* Fondo desde CSS */}
                <strong>Mínimo:</strong>
                <p>
                  {data1006[0].data?.low || 'Data not available'}
                  {renderArrowIcon(data1006[0].data?.low)}
                </p>
              </div>
              <div className="trm-data-row">
                <div className="circular-icon cierre"></div> {/* Fondo desde CSS */}
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
