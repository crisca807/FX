import React from 'react';
import UniqueBanner from './Bannerfx'; // Importa el componente del banner
import Carrusel from './Carruselfx'; // Importa el componente del carrusel
import Dolardelay from '../Delay/Dolardelay';
import Delaysocket from '../Delay/delaysocket';
import IndicatorDelay from '../Delay/indicatordelay';
import NewsComponent from '../Dolarfx/Components/newscomponent';
import Footer from '../Dolarfx/Components/Footer'; // Importa el componente Footer
import Chatws from '../Delay/Chatws'; // Importa el componente flotante
import './Styles/Shared.css';

const Unit = () => {
  return (
    <>
      <div className="main-container-banner-carrusel">
        <UniqueBanner /> {/* Banner */}
        <Carrusel /> {/* Carrusel */}

        <div className="dolardelay-container">
          <h2 className="market-summary-title">Resumen del mercado</h2> {/* Título del mercado */}
          <Dolardelay /> {/* Componente Dolardelay */}

          <div className="delaysocket-container">
            <Delaysocket /> {/* Contenedor para Delaysocket */}
            <div className="infomounts-socket-container"> 
              <IndicatorDelay /> {/* Contenedor para IndicatorDelay */}
            </div>
          </div>

          {/* Contenedor para NewsComponent */}
          <div className="infonews-socket-container">
            <NewsComponent /> {/* Componente de noticias */}
        
          </div>
   
        </div>
        <Footer />
        {/* Componente flotante de Chatws */}
        <Chatws />
      </div>

     
    
   
    </>
  );
};

export default Unit;
