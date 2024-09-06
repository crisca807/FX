import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import '../styles/Banner.css';
import logo from '../../../Assets/Images/LOGO_SET_ICAP_FX-removebg-preview.png'; // Asegúrate de actualizar la ruta del logo

const Banner = () => {
  return (
    <div className="banner-custom">
      <div className="logo-custom">
        <img src={logo} alt="Logo" />
      </div>
      <div className="nav-links-custom">
      
        <a href="#contactanos">Spot USD/COP</a>
        <a href="#registrarse">Next day USD/COP</a>
        <a href="#">Estadísticas</a>
      </div>
    </div>
  );
};

export default Banner;
