// src/webSocketService.js

import { handleWebSocketData } from '../Pages/Adapters/adaptorprom';

// Función para conectar al WebSocket
export const connectWebSocket = (token, onMessageReceived) => {
    // Define la URL del WebSocket con el token como parámetro de consulta
    const wsUrl = `ws://set-fx.com/ws/echo?token=${token}`;
  
    // Crea una nueva instancia de WebSocket
    const socket = new WebSocket(wsUrl);
  
    // Evento que se activa cuando la conexión se establece
    socket.onopen = () => {
      console.log('WebSocket connection established');
      alert('Se estableció la conexión WebSocket exitosamente');
    };
  
    // Evento que se activa cuando se recibe un mensaje
    socket.onmessage = (event) => {
      console.log('Message received:', event.data);

      // Mostrar alerta cuando se están recibiendo datos
      alert('Recibiendo datos');
      
      // Llama a la función de callback con los datos recibidos
      try {
        const messageData = JSON.parse(event.data);
        
        // Mostrar alerta cuando los datos están siendo procesados
        alert('Procesando datos');
        
        onMessageReceived(messageData);
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    };
  
    // Evento que se activa cuando la conexión se cierra
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  
    // Evento que se activa cuando ocurre un error
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    return socket;
};
