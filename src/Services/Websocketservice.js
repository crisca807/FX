import * as neffos from 'neffos.js';

// URL base para el WebSocket
const WS_BASE_URL = 'http://set-fx.com/ws/echo';

// Función para conectar al WebSocket usando el token
export const connectWebSocket = async (token, setMessage) => {
  try {
    // Verifica si setMessage es una función
    if (typeof setMessage !== 'function') {
      throw new Error('setMessage no es una función');
    }

    // Conecta al WebSocket usando el token
    const wsURL = `${WS_BASE_URL}?token=${token}`;

    // Conecta al WebSocket usando neffos
    const conn = await neffos.dial(wsURL, {
      dolar: {  // Asegúrate de que 'dolar' es el namespace correcto
        _OnNamespaceConnected: function (nsConn, msg) {
          if (nsConn.conn.wasReconnected()) {
            console.log('Re-connected after ' + nsConn.conn.reconnectTries.toString() + ' trie(s)');
          }
          console.log('Connected to namespace: ' + msg.Namespace);
        },
        _OnNamespaceDisconnect: function (nsConn, msg) {
          console.log('Disconnected from namespace: ' + msg.Namespace);
        },
        chat: function (nsConn, msg) {
          console.log('Message from chat:', msg.Body);
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

    // Mensaje de éxito
    setMessage('Conexión WebSocket exitosa');

    // Puedes agregar más lógica para manejar la conexión aquí

  } catch (error) {
    console.error('Error al conectar al WebSocket:', error.message);
    setMessage('Error al conectar al WebSocket'); // Mensaje de error
  }
};
