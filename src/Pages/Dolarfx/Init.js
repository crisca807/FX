import React from 'react';
import Banner from '../Dolarfx/Components/Banner.js';
import Dolarsocket from './Components/Dolarsocket.js';
import DolarInfo from './Components/Dolarrest.js';
import Trm from './Components/TrmReal.js';
import Mount from './Components/Mount.js';
import Average from './Components/Average.js';

import '../Dolarfx/styles/Init.css'; 
 // Asegúrate de importar el CSS principal

const Init = () => {
  return (
    <div>
      <div className="Banner-container">
        <Banner />
      </div>
      <div className="main-container">
        <Dolarsocket />
        <DolarInfo />
        <div className="info-container-dolar">
          <Trm />
          <Mount />
        </div>
        <div className="average-container">
          <Average />
        </div>
      </div>
    </div>
  );
};

export default Init;