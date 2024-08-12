import React from 'react';
import Banner from '../Dolarfx/Components/Bannerfx.js';
import Carrusel from '../Dolarfx/Components/Carruselfx.js';
import '../Dolarfx/styles/Carrusel.css'; // Asegúrate de importar el CSS principal

const App = () => {
  return (
    <div className="main-container">
      <Banner />
      <Carrusel />
    </div>
  );
};

export default App;
