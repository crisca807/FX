import React from 'react';
import Banner from '../Dolarfx/Components/Bannerfx.js';
import Carrusel from '../Dolarfx/Components/Carruselfx.js';
import '../Dolarfx/styles/Carrusel.css'; // Asegúrate de importar el CSS principal
import Bannerfx from '../Dolarfx/Components/Bannerfx.js';

const Home= () => {
  return (
    <div className="main-container">
      <Bannerfx />
      <Carrusel />

    </div>
  );
};

export default Home;
