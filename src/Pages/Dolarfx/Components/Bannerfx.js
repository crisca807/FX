import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom
import '../styles/Bannerfx.css';
import logo from '../../../Assets/Images/set_nigga-removebg-preview.png'; // Asegúrate de actualizar la ruta del logo

const Bannerfx = () => {
  return (
    <div className="banner">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="nav-links">
        <a href="#inicio">Inicio</a>
        <a href="#contactanos">Contáctanos</a>
        <a href="#registrarse">Regístrese y Obtenga un Demo</a>
        <Link to="/login">Iniciar Sesión</Link> {/* Usa Link para navegar a /login */}
        <a href="#pagar-epayco">Pagar con ePayco</a>
      </div>
    </div>
  );
};

export default Bannerfx;
