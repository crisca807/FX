import React from 'react';
import '../../Dolarfx/styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-logo-section">
        <div className="company-logo"></div> {/* Logo cargado desde CSS */}
       
        <div className="footer-social-icons">
          <a href="#" className="social-icon facebook"></a>
          <a href="#" className="social-icon twitter"></a>
        
          <a href="#" className="social-icon linkedin"></a>
        </div>
      </div>
      <div className="footer-column">
        <h3>Políticas</h3>
        <a href="#">Política de Privacidad y Tratamiento de Datos Personales</a>
        <a href="#">Términos y Condiciones de Uso</a>
      </div>
      <div className="footer-column">
        <h3>Mapa del sitio</h3>
        <a href="#">Productos y Servicios</a>
        <a href="#">Mercado Cambiario</a>
        <a href="#">Set FX</a>
        <a href="#">Contacto</a>
      </div>
      <div className="footer-column">
        <h3>Póngase en contacto con nosotros</h3>
        <a href="#">Cra. 11 No. 93 - 46 Oficina 403</a>
        <a href="#">Llámenos: (601) 742 77 77</a>
        <a href="#">Escríbanos: info@set-icap.co</a>
        <a href="#">PQRS: quejasyreclamos@set-icap.co</a>
        <a href="#">Bogotá D.C</a>
      </div>
    </footer>
  );
};

export default Footer;
