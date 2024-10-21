import React from 'react';

import Delaysocket from '../Delay/delaysocket';
import TrmDelay from '../Delay/Trmdelay';
import MountDelay from '../Delay/Mountdelay';
import NewsComponent from '../Dolarfx/Components/newscomponent';
import './Styles/Shared.css';

const Unit = () => {
  return (
    <div className="main-container-banner-carrusel"> {/* Contenedor padre compartido */}

      <div className="delaysocket-container"> {/* Contenedor específico para DelaySocket */}
        <h2 className="market-summary-title">Resumen del mercado</h2> {/* Título agregado dentro del contenedor */}
        <Delaysocket /> {/* Delaysocket */}

        {/* Nuevo contenedor para TrmDelay y MountDelay */}
       
        </div>
      </div>
  
  );
};

export default Unit;
