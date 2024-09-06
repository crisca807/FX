import React from 'react';
import Banner from '../Dolarfx/Components/Banner.js';
import ConnectionStatus from './Components/axiosresponse.js';
import DolarInfo from './Components/Dolarrest.js';

import '../Dolarfx/styles/Carrusel.css'; // Asegúrate de importar el CSS principal

const Init = () => {
  return (
    <div className="main-container">
      <Banner />
      <ConnectionStatus />
      <DolarInfo />
    </div>
  );
};

export default Init;
