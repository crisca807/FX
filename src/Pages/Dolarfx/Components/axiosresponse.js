import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connectWebSocket } from '../../Services/Websocketservice';
import JSON5 from 'json5';
import '../styles/Status.css'; // Importar el archivo CSS

const ConnectionStatus = () => {
  const [status, setStatus] = useState('Checking connection...');
  const [error, setError] = useState(null);
  const [data1007, setData1007] = useState([]);
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

            if (parsedMessage?.id === 1007) {
              setData1007((prevData) => {
                const newData = [...prevData, parsedMessage];
                return newData.slice(-2); // Keep only the last 2 elements
              });
              console.log('Updated data for ID 1007:', parsedMessage);
            }
          });

          setStatus('Connection successful!');
        } else {
          setStatus('No token provided');
          setData1007([]); // Clear the data array if no token
        }
      } catch (err) {
        setStatus('Connection failed');
        setError('An error occurred: ' + err.message);
      }
    };

    checkConnection();
  }, [location.state?.token]);

  useEffect(() => {
    // Refresh the list every 5 seconds
    const intervalId = setInterval(() => {
      setData1007((prevData) => [...prevData]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [data1007]);

  const renderData = (item) => {
    if (!item) return <p>No data available</p>;

    // Directly access the data without formatting
    const avg = item.data?.avg || 'Data not available';
    const close = item.data?.close || 'Data not available';

    return (
      <div className="data-container">
        <div className="datadolar-box avg-box">
          <h2>Promedio</h2>
          <p>{avg}</p>
        </div>
        <div className="datadolar-box close-box">
          <h2>Cierre</h2>
          <p>{close}</p>
        </div>
      </div>
    );
  };

  // Sort the data array by timestamp in descending order (newest first)
  const sortedData = data1007.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="dolar-info">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {location.state?.token ? (
          sortedData.length > 0 ? (
            renderData(sortedData[0]) // Show only the latest element
          ) : (
            <p>No data received for ID 1007.</p>
          )
        ) : (
          <p>No token available to fetch data.</p>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;
