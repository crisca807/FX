import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import logo from '../../Assets/Images/set_nigga-removebg-preview.png'; // Asegúrate de actualizar la ruta del logo
import './Styles/Shared.css'
const UniqueBanner = () => {
  return (
    <div className="unique-banner-container"> {/* Cambiado a un nombre de clase único */}
      <div className="unique-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="unique-nav-links">
        <a href="#inicio">Inicio</a>
        <a href="#contactanos">Contáctanos</a>
        <a href="#registrarse">Regístrese y Obtenga un Demo</a>
        <Link to="/login">Iniciar Sesión</Link>
        <a href="#pagar-epayco">Pagar con ePayco</a>
      </div>
    </div>
  );
};

export default UniqueBanner;
