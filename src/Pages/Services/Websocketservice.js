import * as neffos from 'neffos.js';

// URL base actualizada para el WebSocket
const WS_BASE_URL = 'ws://set-fx.com/ws/dolar';

// Función para conectar al WebSocket usando el token
export const connectWebSocket = async (token, onMessageReceived) => {
  try {
    // Verifica si onMessageReceived es una función
    if (typeof onMessageReceived !== 'function') {
      throw new Error('onMessageReceived no es una función');
    }

    // Conecta al WebSocket usando el token
    const wsURL = `${WS_BASE_URL}?token=${token}`;  // Aquí se utiliza la nueva URL base con el token

    // Conecta al WebSocket usando neffos
    const conn = await neffos.dial(wsURL, {
      dolar: {  // Asegúrate de que 'dolar' es el namespace correcto
        _OnNamespaceConnected: function (nsConn) {
          if (nsConn.conn.wasReconnected()) {
            // Manejar reconexión si es necesario
          }
          // Conectado al namespace, sin imprimir en consola
        },
        _OnNamespaceDisconnect: function (nsConn) {
          // Manejar desconexión si es necesario
        },
        chat: function (nsConn, msg) {
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
    const nsConn = await conn.connect('dolar');
    nsConn.emit('chat', 'Hello from client side!');

    // Lógica adicional si es necesario, sin imprimir en consola
  } catch (error) {
    console.error('Error al conectar al WebSocket:', error.message);
  }
};
