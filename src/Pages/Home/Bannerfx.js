import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserPlus, FaSignInAlt } from 'react-icons/fa'; // Importamos algunos iconos
import logo from '../../Assets/Images/set icap.png';
import './Styles/Bannerfx.css';

const UniqueBanner = ({ onPayClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="unique-banner-container">
      <div className="unique-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="hamburger-menu" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`unique-nav-links ${menuOpen ? 'open' : ''}`}>
        {/* Botón "X" visible solo en móvil */}
        {menuOpen && (
          <button className="close-menu" onClick={closeMenu}>
            X
          </button>
        )}
        <a href="#inicio">
          <FaHome className="nav-icon" /> Inicio
        </a>
        <Link to="/register">
          <FaUserPlus className="nav-icon" /> Regístrate y obtén un demo
        </Link>
        <Link to="/login">
          <FaSignInAlt className="nav-icon" /> Iniciar sesión
        </Link>
        <button className="pay-link" onClick={onPayClick}>
          Pagar con ePayco
        </button>
      </div>
    </div>
  );
};

export default UniqueBanner;
