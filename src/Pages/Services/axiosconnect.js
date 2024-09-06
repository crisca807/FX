// src/Services/axiosconnect.js
import axios from 'axios';

// URL de la API para obtener el token
const TOKEN_URL = 'http://set-fx.com/api/v1/auth/access/token/';

// Función para obtener el token
export const getToken = async (username, password) => {
  try {
    // Datos para solicitar el token
    const requestData = {
      grant_type: 'password',
      username,
      password,
      project_id: '19e28843-6f59-461e-af9e-effbce1f5dd4'
    };

    // Solicita el token
    const response = await axios.post(TOKEN_URL, requestData);
    console.log('Response data:', response.data); // Imprime la respuesta para depurar

    // Verifica la estructura de la respuesta
    if (response.data?.payload?.access_token) {
      const token = response.data.payload.access_token;

      // Devuelve el token para que pueda ser utilizado en otro lugar
      return { success: true, token };
    } else {
      throw new Error('No se recibió el token en la respuesta.');
    }

  } catch (error) {
    console.error('Error al obtener el token:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};


