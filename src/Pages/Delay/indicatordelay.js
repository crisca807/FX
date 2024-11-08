// IndicatorDelay.js
import React, { useState, useEffect } from 'react';
import TrmDelay from '../Delay/Trmdelay';
import MountDelay from '../Delay/Mountdelay';
import { useWebSocketDelay } from '../Context/WebSocketContextDelay';
import '../Delay/Styles/Indicatordelay.css';

const IndicatorDelay = () => {
    const [activeTab, setActiveTab] = useState('trm');
    const [transitionDirection, setTransitionDirection] = useState('');
    const [currentData, setCurrentData] = useState(null);

    const { message, getStoredDataForId } = useWebSocketDelay(); // Asegúrate de que getStoredDataForId esté disponible aquí

    const handleTabClick = (tab) => {
        if (tab !== activeTab) {
            setTransitionDirection(tab === 'trm' ? 'slide-right' : 'slide-left');
            setTimeout(() => {
                setActiveTab(tab);
            }, 300);

            const id = tab === 'trm' ? 1010 : 1011;
            const storedData = getStoredDataForId ? getStoredDataForId(id) : null;
            setCurrentData(storedData || message);
        }
    };

    useEffect(() => {
        if (message) {
            setCurrentData(message);
        }
    }, [message]);

    return (
        <div className="IndicatorDelay-container">
            {/* Menú de Pestañas */}
            <div className="IndicatorDelay-tab-menu">
                <button
                    className={`IndicatorDelay-tab-button ${activeTab === 'trm' ? 'IndicatorDelay-active' : ''}`}
                    onClick={() => handleTabClick('trm')}
                >
                    TRM
                </button>
                <button
                    className={`IndicatorDelay-tab-button ${activeTab === 'mount' ? 'IndicatorDelay-active' : ''}`}
                    onClick={() => handleTabClick('mount')}
                >
                    Montos
                </button>
            </div>

            {/* Contenido de la Pestaña Activa */}
            <div className={`IndicatorDelay-tab-content ${transitionDirection}`}>
                {activeTab === 'trm' && <TrmDelay data={currentData} />}
                {activeTab === 'mount' && <MountDelay data={currentData} />}
            </div>
        </div>
    );
};

export default IndicatorDelay;
