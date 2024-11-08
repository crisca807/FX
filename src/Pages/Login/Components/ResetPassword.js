import React, { useState } from 'react';
import '../styled/Resetpassword.css'; // Asegúrate de tener este archivo CSS en la ubicación correcta
import logo from '../../../Assets/Images/set icap.png'; // Cambia esta ruta por la del logo que desees usar

const Resetpassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscar cuenta para:', emailOrPhone);
  };

  return (
    <div className="reset-password-page">
      <img src={logo} alt="Logo" className="find-account-logo-top" />
      <div className="find-account-container">
        <h2 className="find-account-title">Encuentre su cuenta</h2>
        <form onSubmit={handleSearch}>
          <div className="find-account-form-group">
            <label htmlFor="emailOrPhone" className="find-account-label">
              Correo electrónico, nombre de usuario o número de teléfono, incluido el código de país
            </label>
            <input
              type="text"
              id="emailOrPhone"
              placeholder=""
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
              className="find-account-input"
            />
          </div>
          <div className="find-account-captcha-box">
            <input type="checkbox" id="captcha" className="find-account-captcha-checkbox" />
            <label htmlFor="captcha" className="find-account-captcha-label">No soy un robot</label>
          </div>
          <button type="submit" className="find-account-search-button">Buscar</button>
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;
