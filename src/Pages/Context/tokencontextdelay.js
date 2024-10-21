import React, { createContext, useContext, useEffect, useState } from 'react';
import { requestAccessToken } from '../../Pages/Services/Axiosdelay'; // Cambia a requestAccessToken

const TokenContextDelay = createContext(null);

export const TokenProviderDelay = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Suponiendo que tienes el username y password en algún lugar (puedes usar localStorage u otro método)
        const username = 'user';  // Cambia esto por el usuario real
        const password = 'pass';  // Cambia esto por la contraseña real

        const response = await requestAccessToken(username, password); // Cambia a requestAccessToken
        if (response.success) {
          setToken(response.token);
        } else {
          throw new Error(response.error || 'Error desconocido al obtener el token.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return (
    <TokenContextDelay.Provider value={{ token, loading, error }}>
      {children}
    </TokenContextDelay.Provider>
  );
};

export const useTokenDelay = () => {
  const context = useContext(TokenContextDelay);
  if (!context) {
    throw new Error('useTokenDelay debe estar dentro de TokenProviderDelay');
  }
  return context;
};
