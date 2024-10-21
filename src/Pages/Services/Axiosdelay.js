// src/Services/axiosConnectService.js
import axios from 'axios';

// URL de la API para obtener el token
const API_TOKEN_URL = 'http://set-fx.com/api/v1/auth/access/token/';

// Credenciales para la solicitud del token
const DEFAULT_USERNAME = 'sysdev';
const DEFAULT_PASSWORD = '$MasterDev1972*';

// Función para obtener el token desde la API y guardarlo en localStorage
export const requestAccessToken = async () => {
  try {
    // Datos para la solicitud del token
    const payload = {
      grant_type: 'password',
      username: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD,
      project_id: '19e28843-6f59-461e-af9e-effbce1f5dd4'
    };

    // Realiza la solicitud a la API para obtener el token
    const response = await axios.post(API_TOKEN_URL, payload);
    console.log('Datos de la respuesta:', response.data); // Imprime la respuesta para depurar

    // Verifica la estructura de la respuesta
    if (response.data?.payload?.access_token) {
      const accessToken = response.data.payload.access_token;

      // Guarda el token en localStorage
      localStorage.setItem('token', accessToken);

      console.log('Token guardado en localStorage:', accessToken);
      return { success: true, token: accessToken };
    } else {
      throw new Error('El token no fue recibido en la respuesta.');
    }

  } catch (error) {
    console.error('Error al solicitar el token:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};
