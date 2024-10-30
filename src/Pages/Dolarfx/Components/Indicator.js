import React, { useState } from 'react';
import Trm from '../Components/TrmReal';
import Mount from '../Components/Mount.js';
import '../styles/Indicator.css';

const Indicator = () => {
  const [activeTab, setActiveTab] = useState('price'); // Estado para manejar la pestaña activa
  const [transitionDirection, setTransitionDirection] = useState(''); // Controla la dirección de la transición

  const handleTabClick = (tab) => {
    if (tab !== activeTab) {
      setTransitionDirection(tab === 'price' ? 'slide-right' : 'slide-left'); // Cambia la dirección
      setTimeout(() => {
        setActiveTab(tab);
      }, 300); // Ajusta el tiempo para que coincida con la animación en CSS
    }
  };

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
        {activeTab === 'price' && <Trm />}
        {activeTab === 'average' && <Mount />}
      </div>
    </div>
  );
};

export default Indicator;
