import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connectWebSocket } from '../../Services/Websocketservice';
import JSON5 from 'json5';
import '../styles/Trm.css'; // Cambié el nombre del archivo CSS

const Mount = () => {
  const [status, setStatus] = useState('Checking connection...');
  const [error, setError] = useState(null);
  const [data1005, setData1005] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setStatus('Obtaining token...');
        const token = location.state?.token;

        if (token) {
          setStatus('Connecting to WebSocket...');

          await connectWebSocket(token, (message) => {
            console.log('Received message in component:', message);

            let parsedMessage;
            try {
              parsedMessage = JSON5.parse(message);
            } catch (e) {
              console.error('Error parsing data with JSON5:', e.message);
              parsedMessage = { rawMessage: message };
            }

            // Filtrar solo datos del market 71
            if (parsedMessage?.id === 1005 && parsedMessage?.market === 71) {
              setData1005((prevData) => {
                const newData = [...prevData, parsedMessage];
                return newData.slice(-20); // Mantener solo el último elemento
              });
              console.log('Updated data for ID 1005 and market 71:', parsedMessage);
            }
          });

          setStatus('Connection successful!');
        } else {
          setStatus('No token provided');
          setData1005([]); // Limpia los datos si no hay token
        }
      } catch (err) {
        setStatus('Connection failed');
        setError('An error occurred: ' + err.message);
      }
    };

    checkConnection();
  }, [location.state?.token]);

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
        {location.state?.token ? (
          latestData ? (
            <div className="unique-table-container">
              <h1 className="unique-table-title">Precios del dolar (Market 71)</h1>
              <div className="unique-data-table">
                <div className="unique-data-row">
                  <div className="unique-data-item">
                    <strong>Sum:</strong>
                    <p>{latestData.data?.sum || 'Data not available'}</p>
                  </div>
                  <div className="unique-data-item">
                    <strong>Open:</strong>
                    <p>{latestData.data?.open || 'Data not available'}</p>
                  </div>
                  <div className="unique-data-item">
                    <strong>Avg:</strong>
                    <p>{latestData.data?.avg || 'Data not available'}</p>
                  </div>
                  <div className="unique-data-item">
                    <strong>Low:</strong>
                    <p>{latestData.data?.low || 'Data not available'}</p>
                  </div>
                  <div className="unique-data-item">
                    <strong>High:</strong>
                    <p>{latestData.data?.high || 'Data not available'}</p>
                  </div>
                  <div className="unique-data-item">
                    <strong>Count:</strong>
                    <p>{latestData.data?.count || 'Data not available'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No data received for ID 1005 and market 71.</p>
          )
        ) : (
          <p>No token available to fetch data.</p>
        )}
      </div>
    </div>
  );
};

export default Mount;
