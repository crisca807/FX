import React from 'react';
import '../styles/Banner.css';
import logo from '../../../Assets/Images/set_nigga-removebg-preview.png'; // Asegúrate de actualizar la ruta del logo

const Banner = () => {
  return (
    <div className="banner">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="nav-links">
        <a href="#inicio">Inicio</a>
        <a href="#contactanos">Contáctanos</a>
        <a href="#registrarse">Regístrese y Obtenga un Demo</a>
        <a href="#iniciar-sesion">Iniciar Sesión</a>
        <a href="#pagar-epayco">Pagar con ePayco</a>
      </div>
    </div>
  );
};

export default Banner;