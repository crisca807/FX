import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faBank, faCircleUp, faCircleDown, faChartLine } from '@fortawesome/free-solid-svg-icons'; // Nuevos íconos
import { useWebSocketDelay } from '../Context/WebSocketContextDelay';
import JSON5 from 'json5'; 
import '../../Pages/Delay/Styles/Trmdelay.css';

const TrmDelay = () => {
  const [data1006, setData1006] = useState([]);
  const { message, error } = useWebSocketDelay();

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

  return (
    <div className="delay-trmdelay-container">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div className="delay-trmdelay-data">
        {data1006.length > 0 ? (
          <div className="delay-trm-table-container">
            <h1 className="delay-trm-table-title">Precios del dólar</h1>
            <div className="delay-trm-data-table">
              <div className="delay-trm-data-row">
                <div className="delay-circular-icon">
                  <FontAwesomeIcon icon={faBank} style={{ color: '#000000 ', marginRight: '10px' }} />
                </div>
                <strong className="delay-trm-title">TRM:</strong>
                <p className="delay-trm-value">
                  {data1006[0].data?.trm || 'Data not available'}
                 
                </p>
              </div>
              <div className="delay-trm-data-row">
                <div className="delay-circular-icon">
                  <FontAwesomeIcon icon={faChartLine} style={{ color: '#000000 ', marginRight: '10px' }} />
                </div>
                <strong className="delay-trm-title">Apertura:</strong>
                <p className="delay-trm-value">
                  {data1006[0].data?.open || 'Data not available'}
                </p>
              </div>
              <div className="delay-trm-data-row">
                <div className="delay-circular-icon">
                  <FontAwesomeIcon icon={faCircleDown} style={{ color: '#000000 ', marginRight: '10px' }} />
                </div>
                <strong className="delay-trm-title">Mínimo:</strong>
                <p className="delay-trm-value">
                  {data1006[0].data?.low || 'Data not available'}
                </p>
              </div>
              <div className="delay-trm-data-row">
                <div className="delay-circular-icon">
                  <FontAwesomeIcon icon={faCircleUp} style={{ color: '#000000 ', marginRight: '10px' }} />
                </div>
                <strong className="delay-trm-title">Máximo:</strong>
                <p className="delay-trm-value">
                  {data1006[0].data?.high || 'Data not available'}
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
