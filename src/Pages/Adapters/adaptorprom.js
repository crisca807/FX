// src/adaption.js

// Función para manejar y procesar los datos del WebSocket
export const handleWebSocketData = (data, sendDataToComponent) => {
    console.log('Data received in adaption.js:', data);

    // Modificar los datos según sea necesario
    const modifiedData = {
        ...data,
        additionalInfo: 'Este es un dato adicional',
        timestamp: new Date().toISOString(),
    };

    // Guardar los datos modificados en el almacenamiento local
    localStorage.setItem('webSocketData', JSON.stringify(modifiedData));

    // Enviar los datos modificados al componente
    if (typeof sendDataToComponent === 'function') {
        sendDataToComponent(modifiedData);
    }
};
