import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../Assets/Images/set_nigga-removebg-preview.png';
import './Styles/Shared.css';

const UniqueBanner = ({ onPayClick }) => {
  return (
    <div className="unique-banner-container">
      <div className="unique-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="unique-nav-links">
        <a href="#inicio">Inicio</a>
        <Link to="/register">Regsitrese y obtenga un demo</Link>
        <Link to="/login">Iniciar Sesión</Link>
        <button className="pay-link" onClick={onPayClick}>Pagar con ePayco</button>
      </div>
    </div>
  );
};

export default UniqueBanner;
