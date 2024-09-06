import * as neffos from 'neffos.js';

// URL base para el WebSocket
const WS_BASE_URL = 'http://set-fx.com/ws/echo';

// Función para conectar al WebSocket usando el token
export const connectWebSocket = async (token, onMessageReceived) => {
  try {
    // Verifica si onMessageReceived es una función
    if (typeof onMessageReceived !== 'function') {
      throw new Error('onMessageReceived no es una función');
    }

    // Conecta al WebSocket usando el token
    const wsURL = `${WS_BASE_URL}?token=${token}`;

    // Conecta al WebSocket usando neffos
    const conn = await neffos.dial(wsURL, {
      dolar_delay: {  // Asegúrate de que 'dolar' es el namespace correcto
        _OnNamespaceConnected: function (nsConn, msg) {
          if (nsConn.conn.wasReconnected()) {
            console.log('Re-conectado después de ' + nsConn.conn.reconnectTries.toString() + ' intento(s)');
          }
          console.log('Conectado al namespace: ' + msg.Namespace);
        },
        _OnNamespaceDisconnect: function (nsConn, msg) {
          console.log('Desconectado del namespace: ' + msg.Namespace);
        },
        chat: function (nsConn, msg) {
          console.log('Mensaje recibido del WebSocket:', msg.Body);
          onMessageReceived(msg.Body); // Enviar el mensaje recibido a la función callback
        }
      }
    }, {
      reconnect: 2000,
      headers: {
        // Puedes agregar cabeceras personalizadas aquí si es necesario
      }
    });

    // Conectar al namespace 'dolar'
    const nsConn = await conn.connect('dolar_delay');
    nsConn.emit('chat', 'Hello from client side!');

    // Mensaje de éxito
    console.log('Conexión WebSocket exitosa');

    // Puedes agregar más lógica para manejar la conexión aquí

  } catch (error) {
    console.error('Error al conectar al WebSocket:', error.message);
  }
};
