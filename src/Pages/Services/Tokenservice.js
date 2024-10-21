// src/Services/TokenService.js
import { getToken } from './axiosconnect';

class TokenService {
  constructor() {
    this.token = localStorage.getItem('token-socket'); // Intentar cargar el token desde localStorage con el nuevo nombre
    this.isFetching = false; // Evita múltiples peticiones simultáneas
    this.subscribers = []; // Componentes que están esperando por el token
  }

  // Método para obtener el token. Si ya existe en memoria o en localStorage, lo devuelve.
  async fetchToken(username, password) {
    // Si ya tenemos el token en memoria o en localStorage, devolverlo directamente
    if (this.token) {
      return Promise.resolve(this.token);
    }

    // Si ya estamos en proceso de obtener un token, agregar la petición actual a la cola de espera
    if (this.isFetching) {
      return new Promise((resolve) => {
        this.subscribers.push(resolve);
      });
    }

    this.isFetching = true;

    try {
      const { success, token } = await getToken(username, password);

      if (success) {
        this.token = token;

        // Guardar el token en localStorage con el nuevo nombre
        localStorage.setItem('token-socket', this.token);

        // Notifica a los suscriptores que ya tenemos el token
        this.subscribers.forEach((resolve) => resolve(this.token));
        this.subscribers = []; // Limpiamos los suscriptores
        return this.token;
      } else {
        throw new Error('No se pudo obtener el token');
      }
    } catch (error) {
      console.error('Error obteniendo el token:', error);
      return null;
    } finally {
      this.isFetching = false;
    }
  }

  // Método para limpiar el token (en caso de logout o expiración)
  clearToken() {
    this.token = null;
    localStorage.removeItem('token-socket'); // Limpia el token del localStorage con el nuevo nombre
  }
}

// Exportamos una única instancia de TokenService
const instance = new TokenService();
export default instance;
