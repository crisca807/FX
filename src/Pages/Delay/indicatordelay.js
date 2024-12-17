import React, { useEffect, useState } from 'react';
import TrmDelay from '../Delay/Trmdelay';
import MountDelay from '../Delay/Mountdelay';
import { useWebSocketDelay } from '../Context/WebSocketContextDelay';
import '../Delay/Styles/Indicatordelay.css';

const IndicatorDelay = () => {
    const [currentData, setCurrentData] = useState(null);

    const { message, getStoredDataForId } = useWebSocketDelay();

    // Efecto para manejar los datos entrantes
    useEffect(() => {
        if (message) {
            setCurrentData(message);
        }
    }, [message]);

    return (
        <div className="IndicatorDelay-container">
            {/* Título general */}
            <h2 className="IndicatorDelay-title">Resumen de Precios</h2>

            {/* Renderiza ambas tablas en fila */}
            <div className="IndicatorDelay-content">
                {/* Tabla TRM */}
                <div className="IndicatorDelay-section">
               
                    <TrmDelay data={currentData} />
                </div>

                {/* Tabla Montos */}
                <div className="IndicatorDelay-section">
            
                    <MountDelay data={currentData} />
                </div>
            </div>
        </div>
    );
};

export default IndicatorDelay;
