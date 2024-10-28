import React, { useState } from 'react';
import Trm from '../Components/TrmReal';
import Mount from '../Components/Mount.js';

import '../styles/Graphics.css'; 

const Indicator = () => {
  const [activeTab, setActiveTab] = useState('price'); // Estado para manejar la pestaña activa

  return (
    <div className="Indicator-container">
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
         Montos
        </button>
       
      </div>

      {/* Renderización de las gráficas según la pestaña activa */}
      <div className="tab-content">
        {activeTab === 'price' && <Trm />}
        {activeTab === 'average' && <Mount/>}
 
      </div>
    </div>
  );
};

export default Indicator;
