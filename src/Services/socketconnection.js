/*import Neffos from 'neffos.js';
import React from 'react';
import ReactDOM from 'react-dom';
import WebSocketDataComponent from '../Pages/Dolarfx/Components/Prom';

const renderWebSocketComponent = (data = { message: 'No data received.' }) => {
    console.log('Datos para renderizar:', data);

    const existingComponent = document.querySelector('.websocket-component-container');
    if (existingComponent) {
        const componentInstance = existingComponent._reactRootContainer._internalRoot.current.child.stateNode;
        if (componentInstance) {
            componentInstance.setState({ data });
        }
        return;
    }

    const componentDiv = document.createElement('div');
    componentDiv.className = 'websocket-component-container';
    document.body.appendChild(componentDiv);

    ReactDOM.render(
        <WebSocketDataComponent data={data} />,
        componentDiv
    );
};

export const connectWebSocket = (token) => {
    if (!token) {
        console.error('No token provided');
        renderWebSocketComponent({ message: 'Token is required to connect to WebSocket.' });
        return;
    }

    console.log('Token utilizado para la conexión WebSocket:', token);

    const wsUrl = `ws://set-fx.com/ws/echo?token=${token}`;

    try {
        const neffos = new Neffos(wsUrl);

        neffos.connect()
            .then(() => {
                console.log('Neffos connection established');
                renderWebSocketComponent({ message: 'Se estableció la conexión WebSocket exitosamente' });
            })
            .catch((error) => {
                console.error('Error connecting to Neffos:', error);
                renderWebSocketComponent({ message: 'Error al intentar conectarse al WebSocket.' });
            });

        neffos.on('message', (message) => {
            console.log('Mensaje recibido:', message);
            
            try {
                const messageData = JSON.parse(message);
                console.log('Datos parseados del mensaje:', messageData);

                // Agrega un log para verificar el tipo de mensaje
                console.log('Tipo de mensaje recibido:', messageData.type);

                if (messageData.type === 'dolar') {
                    const data = messageData.data;
                    console.log('Datos del dolar recibidos:', data);

                    renderWebSocketComponent(data); // Renderizamos directamente los datos recibidos
                } else if (messageData.type === 'chat') {
                    const chatMessage = messageData.data;
                    console.log('Mensaje de chat recibido:', chatMessage);
                    renderWebSocketComponent({ message: `Chat message: ${chatMessage}` });
                } else {
                    console.log("Tipo de mensaje no reconocido o no es 'dolar' o 'chat':", messageData.type);
                    renderWebSocketComponent({ message: `Tipo de mensaje desconocido: ${messageData.type}` });
                }
            } catch (error) {
                console.error('Error al parsear los datos del mensaje:', error);
                renderWebSocketComponent({ message: 'Error al parsear los datos del mensaje.' });
            }
        });

        neffos.on('close', () => {
            console.log('Conexión de WebSocket cerrada');
            renderWebSocketComponent({ message: 'Conexión de WebSocket cerrada' });
        });

        neffos.on('error', (error) => {
            console.error('Error en WebSocket:', error);
            renderWebSocketComponent({ message: 'Error en WebSocket' });
        });

        return neffos;
    } catch (err) {
        console.error('Error al intentar conectarse al WebSocket:', err);
        renderWebSocketComponent({ message: 'Error al intentar conectarse al WebSocket.' });
    }
