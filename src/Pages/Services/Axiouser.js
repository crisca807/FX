import axios from 'axios';

// URL de la API para el registro
const REGISTER_URL = 'http://set-fx.com/api/v1/auth/users/register'; // Ajusta esta URL según tu API

// Función para registrar un nuevo usuario
export const registerUser = async (username, password, email, displayName) => {
  try {
    // Datos para solicitar el registro
    const requestData = {
      UserName: username,
      UserPassword: password,
      EmailAddress: email,
      Displayname: displayName,
      ProjectID: '19e28843-6f59-461e-af9e-effbce1f5dd4', // ID del proyecto
    };

    // Solicita el registro
    const response = await axios.post(REGISTER_URL, requestData);
    console.log('Response data:', response.data); // Imprime la respuesta para depurar

    // Verifica la estructura de la respuesta
    if (response.status === 200) {
      // Devuelve un objeto con éxito
      return { success: true, message: 'Registro exitoso.' };
    }

  } catch (error) {
    console.error('Error al registrar el usuario:', error.response?.data || error.message);

    // Maneja el error específico basado en el código de estado HTTP
    if (error.response?.status === 409) {
      return { success: false, error: 'El usuario ya existe.' };
    } else {
      // Redirige a /login en caso de otros errores
      return { success: false, error: 'Error en el registro. Por favor, intenta nuevamente.' };
    }
  }
};
