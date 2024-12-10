import React from 'react';
import '../Home/Styles/customswipper.css';

const Carruselfx = () => {
  return (
    <div className="carrusel-container">
      <div className="content-wrapper">
        <div className="text-content">
          <h2>Aliado Pro</h2>
          {/* Aquí eliminamos el div innecesario */}
          <p className="subtitulo">
            "Optimiza la eficiencia financiera de tu negocio
          </p>
          <p>
            con herramientas avanzadas, estrategias personalizadas,
          </p>
          <p>
            maximizando resultados y mejorando el rendimiento."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Carruselfx;
