import React, { useState } from 'react';
import Average from '../Components/Average.js';
import Price from '../Components/Price.js';
import CandleData from '../Components/Candle.js';
import Bollinger from '../Components/Bollinger.js';

import '../styles/Graphics.css'; 

const Graphics = () => {
  const [activeTab, setActiveTab] = useState('price'); // Estado para manejar la pestaña activa

  return (
    <div className="graphics-container">
      {/* Menú de Pestañas */}
      <div className="tab-menu">
        <button
          className={`tab-button price-tab ${activeTab === 'price' ? 'active' : ''}`}
          onClick={() => setActiveTab('price')}
        >
          Precios
        </button>
        <button
          className={`tab-button average-tab ${activeTab === 'average' ? 'active' : ''}`}
          onClick={() => setActiveTab('average')}
        >
          Promedio
        </button>
        <button
          className={`tab-button candle-tab ${activeTab === 'candle' ? 'active' : ''}`}
          onClick={() => setActiveTab('candle')}
        >
          Velas
        </button>
        <button
          className={`tab-button bollinger-tab ${activeTab === 'bollinger' ? 'active' : ''}`}
          onClick={() => setActiveTab('bollinger')}
        >
          Bollinger
        </button>
      </div>

      {/* Renderización de las gráficas según la pestaña activa */}
      <div className="tab-content">
        {activeTab === 'price' && <Price />}
        {activeTab === 'average' && <Average />}
        {activeTab === 'candle' && <CandleData />}
        {activeTab === 'bollinger' && <Bollinger />}
      </div>
    </div>
  );
};

export default Graphics;
