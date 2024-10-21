import * as neffos from 'neffos.js';

// URL base actualizada para el WebSocket
const WS_BASE_URL = 'ws://set-fx.com/ws/dolar';

class WebSocketService {
  constructor() {
    this.connection = null; // Mantiene la conexión WebSocket
    this.nsConn = null; // Mantiene la conexión al namespace
    this.listeners = []; // Lista de listeners para los mensajes
    this.isConnected = false; // Estado de la conexión
  }

  // Conectar al WebSocket usando el token
  async connect() {
    // Verifica si ya hay una conexión activa para evitar duplicados
    if (this.isConnected && this.connection) {
      console.log("Ya hay una conexión activa.");
      return; // Si ya hay una conexión, no hacemos nada más
    }

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token no encontrado en localStorage');
      }

      // Construye la URL del WebSocket con el token
      const wsURL = `${WS_BASE_URL}?token=${token}`;

      // Conectar usando neffos.js
      this.connection = await neffos.dial(wsURL, {
        delay: {  // Cambiado de 'dolar' a 'delay' aquí
          _OnNamespaceConnected: (nsConn) => {
            if (nsConn.conn.wasReconnected()) {
              console.log('Reconectado');
            }
            console.log('Conectado al namespace delay');
            this.nsConn = nsConn; // Guardar la referencia al namespace
          },
          _OnNamespaceDisconnect: (nsConn) => {
            console.log('Desconectado del namespace delay');
            this.isConnected = false; // Cambiar el estado de la conexión
          },
          chat: (nsConn, msg) => {
            // Notificar a todos los listeners registrados
            this.listeners.forEach((listener) => listener(msg.Body));
          }
        }
      }, {
        reconnect: 2000, // Intentar reconectar cada 2 segundos en caso de fallo
        headers: {
          // Aquí puedes añadir cabeceras adicionales si es necesario
        }
      });

      // Conectar al namespace 'delay'
      this.nsConn = await this.connection.connect('delay');
      this.isConnected = true; // Actualiza el estado de conexión
      console.log('Conexión WebSocket establecida con el namespace delay');
    } catch (error) {
      console.error('Error al conectar al WebSocket:', error.message);
    }
  }

  // Método para suscribirse a los mensajes del WebSocket
  addListener(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener); // Agregar el listener a la lista
    } else {
      console.error('addListener necesita una función como argumento');
    }
  }

  // Método para desconectar del WebSocket y del namespace
  disconnect() {
    if (this.nsConn) {
      this.nsConn.close(); // Desconectar del namespace
      this.nsConn = null;
    }
    if (this.connection) {
      this.connection.close(); // Desconectar del WebSocket
      this.connection = null; // Limpiar la conexión
      this.isConnected = false; // Actualizar el estado de conexión
      console.log('Desconectado del WebSocket');
    }
  }

  // Método para enviar mensajes desde el cliente
  emitMessage(message) {
    if (this.nsConn) {
      this.nsConn.emit('chat', message); // Enviar mensaje al namespace 'delay'
    } else {
      console.error('No se puede enviar el mensaje. No hay conexión activa al namespace.');
    }
  }
}

// Exportar una única instancia del WebSocketService
const instance = new WebSocketService();
export default instance;





