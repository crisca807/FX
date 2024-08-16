// src/components/WebSocketDataComponent.js
import React, { useState, useEffect } from 'react';

const WebSocketDataComponent = ({ data }) => {
    return (
        <div>
            <h2>Datos del WebSocket</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default WebSocketDataComponent;
