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
    // Verifica si ya hay una conexión activa o en progreso para evitar duplicados
    if (this.isConnected || this.isConnecting) {
      console.log("Conexión activa o en progreso. No se realizará una nueva conexión.");
      return; // Salir si ya hay una conexión o intento de conexión
    }

    this.isConnecting = true; // Marca que se está intentando conectar

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token-socket');

      if (!token) {
        throw new Error('Token no encontrado en localStorage');
      }

      // Construye la URL del WebSocket con el token
      const wsURL = `${WS_BASE_URL}?token=${token}`;

      // Conectar usando neffos.js
      this.connection = await neffos.dial(wsURL, {
        dolar: {
          _OnNamespaceConnected: (nsConn) => {
            this.isConnected = true; // Cambiar el estado de la conexión a true
            this.isConnecting = false; // Finaliza el estado de conexión en progreso
            this.nsConn = nsConn;
            console.log('Conectado al namespace dolar');
          },
          _OnNamespaceDisconnect: () => {
            console.log('Desconectado del namespace dolar');
            this.isConnected = false; // Cambiar el estado de la conexión
            this.nsConn = null; // Limpiar la conexión del namespace
          },
          chat: (nsConn, msg) => {
            // Notificar a todos los listeners registrados
            this.listeners.forEach((listener) => listener(msg.Body));
          }
        }
      }, {
        reconnect: false, // Desactiva reconexión automática para evitar bucles
      });

      // Conectar al namespace 'dolar'
      this.nsConn = await this.connection.connect('dolar');
      console.log('Conexión WebSocket establecida');
    } catch (error) {
      console.error('Error al conectar al WebSocket:', error.message);
      this.isConnected = false;
      this.isConnecting = false; // Restablece el estado en caso de error
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

  // Método para desconectar el WebSocket si es necesario
  disconnect() {
    if (this.connection) {
      this.connection.close(); // Desconectar del WebSocket
      this.connection = null; // Limpiar la conexión
      this.nsConn = null; // Limpiar la conexión al namespace
      this.isConnected = false; // Actualizar el estado de conexión
      this.isConnecting = false; // Asegura que isConnecting también esté en false
      console.log('Desconectado del WebSocket');
    }
  }

  // Método para enviar mensajes desde el cliente
  emitMessage(message) {
    if (this.nsConn) {
      this.nsConn.emit('chat', message); // Enviar mensaje al namespace 'dolar'
    } else {
      console.error('No se puede enviar el mensaje. No hay conexión activa al namespace.');
    }
  }
}

// Exportar una única instancia del WebSocketService
const instance = new WebSocketService();
export default instance;
