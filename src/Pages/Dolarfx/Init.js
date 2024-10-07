import React from 'react';
import Banner from '../Dolarfx/Components/Banner.js';
import DolarSpot from './Components/Dolarspot.js';
import DolarInfo from './Components/Dolarrest.js';
import Trm from './Components/TrmReal.js';
import Mount from './Components/Mount.js';
import Graphics from './Components/graphics.js';
import NewsComponent from './Components/newscomponent.js';
import '../Dolarfx/styles/Init.css';

const Init = () => {
  const [scrollPosition, setScrollPosition] = React.useState(0);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setScrollPosition(scrollTop);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getTransformStyle = (position) => {
    const maxScroll = 100; // El valor máximo donde la transición termina completamente
    const scrollFactor = Math.min(position / maxScroll, 1); // Limitar el factor a 1
    const translateY = 40 - scrollFactor * 40; // Desplazamiento desde 40px a 0px
    const opacity = scrollFactor; // Opacidad de 0 a 1

    return {
      transform: `translateY(${translateY}px)`,
      opacity: opacity,
      transition: 'transform 0.2s ease-out, opacity 0.2s ease-out', // Transición más lenta
    };
  };

  return (
    <div>
      <div className="Banner-container">
        <Banner />
      </div>

      <div className="main-container">
        <div className="Dolarspot-container">
          <h2 className="dolarspot-title">DOLAR SPOT</h2>
          <DolarSpot />
        </div>

        <div
          className="info-container-dolar"
          style={getTransformStyle(scrollPosition - 500)} /* Aplica el efecto más tarde para info-container-dolar */
        >
          <Trm />
          <Mount />
        </div>

        <div
          className="Graphics-container-dolar"
          style={getTransformStyle(scrollPosition - 700)} /* Aplica el efecto más tarde para Graphics-container-dolar */
        >
          <Graphics />
        </div>

        <div className="News-container">
          <NewsComponent />
          
          
        </div>
      </div>
    </div>
  );
};

export default Init;
