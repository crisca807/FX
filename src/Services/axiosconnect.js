import axios from 'axios';
import { connectWebSocket } from '../Services/Websocketservice'; // Asegúrate de que la ruta sea correcta

// URL de la API para obtener el token
const TOKEN_URL = 'http://set-fx.com/api/v1/auth/access/token/';

// Datos para solicitar el token
const requestData = {
  grant_type: 'password',
  username: 'sysdev',
  password: '$MasterDev1972*',
  project_id: '19e28843-6f59-461e-af9e-effbce1f5dd4'
};

// Función para obtener el token y conectar al WebSocket
const getTokenAndConnectWebSocket = async (setToken, setMessage) => {
  try {
    // Solicita el token
    const response = await axios.post(TOKEN_URL, requestData);
    console.log('Response data:', response.data); // Imprime la respuesta para depurar

    // Verifica la estructura de la respuesta
    if (response.data && response.data.payload && response.data.payload.access_token) {
      const token = response.data.payload.access_token;
      setToken(token); // Establece el token
      setMessage('Token recibido exitosamente'); // Mensaje de éxito

      // Conecta al WebSocket usando el token
      connectWebSocket(token);
    } else {
      throw new Error('No se recibió el token en la respuesta.');
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al obtener el token:', error.response?.data || error.message);
    setMessage('Error al obtener el token'); // Mensaje de error
    return { success: false, error: error.response?.data || error.message };
  }
};

export default getTokenAndConnectWebSocket;
