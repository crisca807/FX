// Chatws.js
import React, { useState } from 'react';
import '../Delay/Styles/Chatws.css'; // Importa el archivo CSS para los estilos

const Chatws = () => {
    const [isOpen, setIsOpen] = useState(false); // Controla si el chat está abierto
    const [message, setMessage] = useState(''); // Guarda el mensaje que el usuario escribe

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = () => {
        // Reemplaza el número de teléfono con tu número de WhatsApp
        const phoneNumber = '3043972237';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div>
            <div className="floating-button" onClick={toggleChat}>
                {/* El ícono de WhatsApp se gestiona en CSS */}
            </div>
            {isOpen && (
                <div className="chat-box">
                    <div className="chat-header">
                        <span>Chat de Soporte</span>
                        <button className="close-btn" onClick={toggleChat}>✖</button>
                    </div>
                    <div className="chat-content">
                        <p>Ana María</p>
                        <div className="chat-message">
                            <span>Hola, ¿Cómo podemos ayudarlo?</span>
                        </div>
                        <textarea
                            placeholder="Escribe tu mensaje..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={sendMessage} className="send-btn">Enviar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatws;
