import React from 'react';
import UniqueBanner from './Bannerfx'; // Importa el componente del banner
import Carrusel from './Carruselfx'; // Importa el componente del carrusel
import './Styles/Shared.css'; // Hoja de estilo compartida

const Home = () => {
  return (
    <div className="main-container-banner-carrusel"> {/* Contenedor padre compartido */}
      <UniqueBanner /> {/* Banner */}
      <Carrusel /> {/* Carrusel */}
    </div>
  );
};

export default Home;
