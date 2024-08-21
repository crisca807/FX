import React, { useEffect, useState } from 'react';
import { getToken } from '../../../Services/axiosconnect'; // Importación con nombre

const ConnectionStatus = () => {
  const [status, setStatus] = useState('Checking connection...');
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await getToken(setToken, setError); // Llama a `getToken` con las funciones de estado
        if (result.success) {
          setToken(result.data.payload.access_token); // Ajusta según la estructura de la respuesta
          setStatus('Connection successful!');
        } else {
          setStatus('Connection failed');
          setError(result.error.message || 'An unknown error occurred.');
        }
      } catch (err) {
        setStatus('Connection failed');
        setError('An error occurred: ' + err.message);
      }
    };

    checkConnection();
  }, []); // Ejecutar solo una vez al montar el componente

  return (
    <div>
      <h1>Connection Status</h1>
      <p>{status}</p>
      {token && <p>Token: {token}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default ConnectionStatus;
