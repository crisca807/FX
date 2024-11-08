import React, { useState, useEffect } from 'react';
import Trm from '../Components/TrmReal';
import Mount from '../Components/Mount';
import { useWebSocket } from '../../Context/Websocketcontext';
import '../styles/Indicator.css';

const Indicator = () => {
  const [activeTab, setActiveTab] = useState('price'); // Estado para manejar la pestaña activa
  const [transitionDirection, setTransitionDirection] = useState(''); // Controla la dirección de la transición
  const [currentData, setCurrentData] = useState(null); // Estado para manejar los datos actuales
  
  const { message, getStoredDataForId } = useWebSocket();

  const handleTabClick = (tab) => {
    if (tab !== activeTab) {
      setTransitionDirection(tab === 'price' ? 'slide-right' : 'slide-left'); // Cambia la dirección de la transición
      setTimeout(() => {
        setActiveTab(tab);
      }, 300); // Ajusta el tiempo para que coincida con la animación en CSS

      // Intentar cargar datos almacenados para la nueva pestaña
      const id = tab === 'price' ? 1005 : 1006; // ID asociado a cada pestaña
      const storedData = getStoredDataForId(id);
      setCurrentData(storedData || message); // Usar datos almacenados o los datos en tiempo real si están disponibles
    }
  };

  useEffect(() => {
    // Actualizar los datos en tiempo real cuando llegan
    if (message) {
      setCurrentData(message);
    }
  }, [message]);

  return (
    <div className="IndicatorDolar-container">
      {/* Menú de Pestañas */}
      <div className="IndicatorDolar-tab-menu">
        <button
          className={`IndicatorDolar-tab-button ${activeTab === 'price' ? 'IndicatorDolar-active' : ''}`}
          onClick={() => handleTabClick('price')}
        >
          Precios
        </button>
        <button
          className={`IndicatorDolar-tab-button ${activeTab === 'average' ? 'IndicatorDolar-active' : ''}`}
          onClick={() => handleTabClick('average')}
        >
          Montos
        </button>
      </div>

      {/* Renderización de las gráficas según la pestaña activa */}
      <div className={`IndicatorDolar-tab-content ${transitionDirection}`}>
        {activeTab === 'price' && <Trm data={currentData} />} {/* Pasar los datos al componente */}
        {activeTab === 'average' && <Mount data={currentData} />} {/* Pasar los datos al componente */}
      </div>
    </div>
  );
};

export default Indicator;
