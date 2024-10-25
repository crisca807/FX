import React from 'react';
import '../Delay/Styles/Footer.css'; // Asegúrate de tener los estilos importados

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-sections">
        
        {/* Nueva sección para el logo y redes sociales */}
        <div className="footer-logo-section">
          <div className="company-logo"></div> {/* Logo de la empresa */}
          <div className="social-icons">
            <div className="social-icon facebook"></div>
            <div className="social-icon instagram"></div>
            <div className="social-icon linkedin"></div>
          </div>
        </div>

        {/* Secciones existentes */}
        <div className="footer-section">
          <h3>Política</h3>
          <ul>
            <li><a href="#">Política de Privacidad</a></li>
            <li><a href="#">Términos y Condiciones</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Mapa del sitio</h3>
          <ul>
            <li><a href="#">Productos y Servicios</a></li>
            <li><a href="#">Mercado Cambiario</a></li>
            <li><a href="#">SET-FX</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Póngase en contacto</h3>
          <ul>
            <li>Cra. 11 No. 93 - 46 Oficina 403</li>
            <li>Tel: (601) 742 77 77</li>
            <li>Email: <a href="mailto:info@set-icap.co">info@set-icap.co</a></li>
            <li>Bogotá D.C</li>
          </ul>
        </div>

        {/* Logos aliados */}
        <div className="footer-section">
          <h3>Aliados</h3>
          <div className="allies-logos">
            <div className="footer-logo tp-icap"></div>
            <div className="footer-logo bvc"></div>
            <div className="footer-logo sfc"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
