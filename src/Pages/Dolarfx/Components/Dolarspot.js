import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connectWebSocket } from '../../Services/Websocketservice';
import '../styles/Trm.css'; // Importar el archivo CSS

const DolarSpot = () => {
  const [status, setStatus] = useState('Checking connection...');
  const [error, setError] = useState(null);
  const [data1000, setData1000] = useState(null); // Solo almacenará el último mensaje
  const location = useLocation();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setStatus('Obtaining token...');
        const token = location.state?.token;

        if (token) {
          setStatus('Connecting to WebSocket...');

          await connectWebSocket(token, (message) => {
            let parsedMessage;
            try {
              parsedMessage = JSON.parse(message);
            } catch (e) {
              parsedMessage = { rawMessage: message };
            }

            // Filtrar solo datos del market 71 y id 1000
            if (parsedMessage?.id === 1000 && parsedMessage?.market === 71) {
              const rawData = parsedMessage.result?.[0]?.datos_grafico_moneda_mercado_rt;

              if (rawData) {
                // Limpiar la cadena eliminando "data:" y cualquier formato inválido
                let cleanedData = rawData
                  .replace(/^data:\s*/, '') // Eliminar el prefijo "data:"
                  .replace(/'/g, '"')        // Reemplazar comillas simples por dobles
                  .replace(/,\s*}$/, '}')    // Eliminar comas colgantes al final de objetos
                  .replace(/,\s*]/g, ']');   // Eliminar comas colgantes al final de arrays

                try {
                  const chartObject = JSON.parse(cleanedData);

                  // Tomar solo el último dato de cada dataset
                  const lastClosingPrice = chartObject.datasets[0]?.data.slice(-1)[0];
                  const lastAmount = chartObject.datasets[1]?.data.slice(-1)[0];
                  const lastLabel = chartObject.labels.slice(-1)[0];

                  setData1000({
                    closingPrice: lastClosingPrice,
                    amount: lastAmount,
                    timeLabel: lastLabel,
                  });
                } catch (parseError) {
                  console.error('Error parsing cleaned data:', parseError);
                }
              }
            }
          });

          setStatus('Connection successful!');
        } else {
          setStatus('No token provided');
          setData1000(null); // Limpiar los datos si no hay token
        }
      } catch (err) {
        setStatus('Connection failed');
        setError('An error occurred: ' + err.message);
      }
    };

    checkConnection();
  }, [location.state?.token]);

  return (
    <div className="unique-dolar-info">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {location.state?.token ? (
          data1000 ? (
            <div className="unique-data-container">
              <h1>Último Dato del Dólar (ID 1000, Market 71)</h1>
              <div className="unique-data-row">
                <div className="unique-data-item">
                  <strong>Precio de cierre:</strong>
                  <p>{data1000.closingPrice || 'Data not available'}</p>
                </div>
                <div className="unique-data-item">
                  <strong>Monto (Miles USD):</strong>
                  <p>{data1000.amount || 'Data not available'}</p>
                </div>
                <div className="unique-data-item">
                  <strong>Etiqueta de tiempo:</strong>
                  <p>{data1000.timeLabel || 'Data not available'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>No data received for ID 1000 and market 71.</p>
          )
        ) : (
          <p>No token available to fetch data.</p>
        )}
      </div>
    </div>
  );
};

export default DolarSpot;
