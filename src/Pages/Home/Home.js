import React from 'react';
import Unit from '../Home/Unit';
import Delaysocket from '../Delay/delaysocket'; 
import SpotDelay from '../Delay/spotdelay';
import TrmDelay from '../Delay/Trmdelay';
import MountDelay from '../Delay/Mountdelay';
import './Styles/home.css'; 
import './Styles/Shared.css'; 

const Home = () => {
  return (
    <div className="main-container-banner-carrusel"> {/* Contenedor padre compartido */}

      {/* Contenedor del componente Unit */}
      <div className="container-unit">
        <Unit /> 
      </div>

     

    </div>
  );
};

export default Home;
