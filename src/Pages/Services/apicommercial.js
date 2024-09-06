// src/Services/apicommercial.js
import axios from 'axios';

const DOLAR_INFO_URL = 'http://set-fx.com/api/v1/apis/comercial/dolarInformacion';

export const postDolarInformacion = async (token) => {
  try {
    const response = await axios.post(DOLAR_INFO_URL, {
      fecha: '2024-08-16',
      mercado: 71,
      retardo: 0
    }, {
      headers: {
        Authorization: `Bearer ${token}` // Incluye el token en las cabeceras de la solicitud
      }
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al obtener información de la API comercial:', error.response?.data || error.message);
    return { success: false, message: error.response?.data || error.message };
  }
};

// Función que hace la petición cada 3 segundos
export const startPolling = async (token) => {
  const intervalId = setInterval(async () => {
    const response = await postDolarInformacion(token);
    console.log('Respuesta:', response);
  }, 1000); // 3000 milisegundos = 3 segundos

  return intervalId;
};

// Función que detiene el polling
export const stopPolling = (intervalId) => {
  clearInterval(intervalId);
};