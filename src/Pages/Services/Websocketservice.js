import * as neffos from 'neffos.js';

// URL base para el WebSocket
const WS_BASE_URL = 'ws://set-fx.com/ws/dolar';

class WebSocketService {
  constructor() {
    this.connection = null; // Mantiene la conexión WebSocket
    this.nsConn = null; // Mantiene la conexión al namespace
    this.listeners = []; // Lista de listeners para los mensajes
    this.isConnected = false; // Estado de la conexión
    this.isConnecting = false; // Estado de conexión en progreso
  }

  // Conectar al WebSocket usando el token
  async connect() {
    // Validar si ya hay una conexión activa o en progreso
    if (this.isConnected || this.isConnecting) {
      console.log("Ya hay una conexión activa o en progreso. No se realizará una nueva conexión.");
      return; // Salir si ya estamos conectados o conectando
    }

    this.isConnecting = true; // Marcamos que estamos intentando conectar

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado en localStorage');
      }

      // Construir la URL del WebSocket con el token
      const wsURL = `${WS_BASE_URL}?token=${token}`;

      // Conectar usando neffos.js
      this.connection = await neffos.dial(wsURL, {
        dolar: {
          _OnNamespaceConnected: (nsConn) => {
            if (nsConn.conn.wasReconnected()) {
              console.log('Reconectado exitosamente.');
            }
            console.log("Conectado al namespace 'dolar'.");
            this.nsConn = nsConn;
            this.isConnected = true;
            this.isConnecting = false;
          },
          _OnNamespaceDisconnect: () => {
            console.log("Desconectado del namespace 'dolar'.");
            this.isConnected = false;
            this.nsConn = null;
          },
          chat: (nsConn, msg) => {
            // Notificar a todos los listeners registrados
            this.listeners.forEach((listener) => listener(msg.Body));
          },
        },
      }, {
        reconnect: 2000, // Intentar reconectar cada 2 segundos en caso de fallo
      });

      // Conectar al namespace 'dolar'
      this.nsConn = await this.connection.connect('dolar');
      this.isConnected = true; // Cambiar el estado de la conexión
      console.log("Conexión WebSocket establecida con el namespace 'dolar'.");
    } catch (error) {
      console.error("Error al conectar al WebSocket:", error.message);
      this.isConnected = false;
    } finally {
      this.isConnecting = false; // Restablecer el estado de conexión
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

  // Método para desconectar el WebSocket
  disconnect() {
    if (this.nsConn) {
      this.nsConn.close(); // Desconectar del namespace
      this.nsConn = null;
    }
    if (this.connection) {
      this.connection.close(); // Desconectar del WebSocket
      this.connection = null; // Limpiar la conexión
      this.isConnected = false; // Actualizar el estado de conexión
      this.isConnecting = false;
      console.log("Desconectado del WebSocket.");
    }
  }

  // Método para enviar mensajes desde el cliente
  emitMessage(message) {
    if (this.nsConn) {
      this.nsConn.emit('chat', message); // Enviar mensaje al namespace 'dolar'
    } else {
      console.error("No se puede enviar el mensaje. No hay conexión activa al namespace.");
    }
  }
}

// Exportar una única instancia del WebSocketService
const instance = new WebSocketService();
export default instance;
