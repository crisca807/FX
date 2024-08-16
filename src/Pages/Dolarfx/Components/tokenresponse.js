import React, { useState, useEffect } from 'react';
import getToken from '../../../Services/axiosconnect'; // Ajusta la ruta según sea necesario

const TokenResponse = () => {
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const result = await getToken(setToken, setMessage);
      if (!result.success) {
        setMessage('Error al obtener el token');
      }
    };

    fetchToken();
  }, []);

  return (
    <div>
      <h1>Token Response</h1>
      {message && <p>{message}</p>}
      {token && <p>Token: {token}</p>}
    </div>
  );
};

export default TokenResponse;
