// src/hooks/useAuthToken.js
import { useState, useEffect } from 'react';
import { getToken } from '../Services/axiosconnect'; // Ajusta la ruta de importación si es necesario

const useAuthToken = (username, password) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getToken(username, password);
        if (response.success) {
          setToken(response.token);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [username, password]);

  return { token, loading, error };
};

export default useAuthToken;
