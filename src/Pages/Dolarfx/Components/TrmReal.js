import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connectWebSocket } from '../../Services/Websocketservice';
import JSON5 from 'json5';
import '../styles/Trm.css'; // Importar el archivo CSS

const UniqueTrm = () => {
  const [status, setStatus] = useState('Checking connection...');
  const [error, setError] = useState(null);
  const [data1006, setData1006] = useState([]);
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
            if (parsedMessage?.id === 1006 && parsedMessage?.market === 71) {
              setData1006((prevData) => {
                const newData = [...prevData, parsedMessage];
                return newData.slice(-1); // Mantener solo el último elemento
              });
              console.log('Updated data for ID 1006 and market 71:', parsedMessage);
            }
          });

          setStatus('Connection successful!');
        } else {
          setStatus('No token provided');
          setData1006([]); // Limpiar los datos si no hay token
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
      setData1006((prevData) => [...prevData]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [data1006]);

  // Ordenar los datos por timestamp en orden descendente (más recientes primero)
  const sortedData = data1006.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="unique-dolar-info">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {location.state?.token ? (
          sortedData.length > 0 ? (
            <div className="unique-table-container">
              <h1 className="unique-table-title">Precios del dolar (Market 71)</h1>
              <div className="unique-data-table">
                <div className="unique-data-row">
                  <div className="unique-data-item">
                    <strong>Apertura:</strong>
                    <p>{sortedData[0].data?.open || 'Data not available'}</p>
                  </div>
                  <div className="unique-data-item">
                    <strong>Mínimo:</strong>
                    <p>{sortedData[0].data?.low || 'Data not available'}</p>
                  </div>
                  <div className="unique-data-item">
                    <strong>Máximo:</strong>
                    <p>{sortedData[0].data?.high || 'Data not available'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No data received for ID 1006 and market 71.</p>
          )
        ) : (
          <p>No token available to fetch data.</p>
        )}
      </div>
    </div>
  );
};

export default UniqueTrm;
