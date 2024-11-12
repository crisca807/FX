import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../Context/Websocketcontext';
import '../styles/Banner.css';
import logo from '../../../Assets/Images/set_nigga-removebg-preview.png';
import { FaUserCircle } from 'react-icons/fa'; // Importa el icono de usuario

const Banner = () => {
  const { logout } = useWebSocket();
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Obtiene el nombre de usuario desde localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="banner-custom">
      <div className="logo-custom">
        <img src={logo} alt="Logo" />
      </div>
      <div className="nav-links-custom">
        <a href="#contactanos">Spot USD/COP</a>
        <a href="#registrarse">Next day USD/COP</a>
        <a href="#">Estadísticas</a>
        <a href="#">Estadísticas</a>
      </div>
      {/* Icono de usuario con menú desplegable */}
      <div className="user-menu-container">
        <FaUserCircle className="user-icon" onClick={toggleMenu} />
        {menuOpen && (
          <div className="user-dropdown">
            <span className="username">{username}</span>
            <button onClick={logout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
