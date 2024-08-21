import React, { useState, useEffect } from 'react';

const WebSocketDataComponent = ({ data = {} }) => {
    const [message, setMessage] = useState('No hay datos disponibles.');

    useEffect(() => {
        console.log("Datos recibidos en WebSocketDataComponent:", data);

        if (data && Object.keys(data).length > 0) {
            setMessage(JSON.stringify(data, null, 2));
        }
    }, [data]);

    return (
        <div>
            <h2>Datos del WebSocket</h2>
            <pre>{message}</pre>
        </div>
    );
};

export default WebSocketDataComponent;
