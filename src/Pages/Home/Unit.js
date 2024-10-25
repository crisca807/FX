import React from 'react';
import UniqueBanner from './Bannerfx'; // Importa el componente del banner
import Carrusel from './Carruselfx'; // Importa el componente del carrusel
import Dolardelay from '../Delay/Dolardelay';
import Delaysocket from '../Delay/delaysocket';
import TrmDelay from '../Delay/Trmdelay';
import MountDelay from '../Delay/Mountdelay';
import NewsComponent from '../Dolarfx/Components/newscomponent';
import Footer from '../Delay/Footerdelay';
import './Styles/Shared.css';

const Unit = () => {
  return (
    <div className="main-container-banner-carrusel">
      <UniqueBanner /> {/* Banner */}
      <Carrusel /> {/* Carrusel */}
      
      <div className="dolardelay-container">
        <h2 className="market-summary-title">Resumen del mercado</h2> {/* Título del mercado */}
        <Dolardelay /> {/* Componente Dolardelay */}
        <div className="delaysocket-container">
          <Delaysocket /> {/* Contenedor para Delaysocket */}
          <div className="infomounts-socket-container"> 
            <TrmDelay /> {/* Contenedor para TrmDelay */}
            <MountDelay /> {/* Contenedor para MountDelay */}
          </div>
        </div>

        {/* Nuevo contenedor para NewsComponent */}
        <div className="infonews-socket-container">
          <NewsComponent /> {/* Contenedor para NewsComponent */}

          <div className="Footer-socket-container">
          <Footer/> {/* Contenedor para NewsComponent */}
          
        </div>
        
      </div>
    </div>
    </div>
  );
};

export default Unit;
