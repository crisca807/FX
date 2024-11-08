import React, { useState } from 'react';
import '../styled/Resetpassword.css'; // Asegúrate de tener este archivo CSS en la ubicación correcta
import logo from '../../../Assets/Images/set icap.png'; // Cambia esta ruta por la del logo que desees usar

const  Resetpassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para buscar la cuenta
    console.log('Buscar cuenta para:', emailOrPhone);
  };

  return (
    <div className="find-account-page">
      <img src={logo} alt="Logo" className="logo-top" />
      <div className="find-account-container">
        <h2>Encuentre su cuenta</h2>
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="emailOrPhone">
              Correo electrónico, nombre de usuario o número de teléfono, incluido el código de país
            </label>
            <input
              type="text"
              id="emailOrPhone"
              placeholder=""
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
          </div>
          {/* Simulación de reCAPTCHA */}
          <div className="captcha-box">
            <input type="checkbox" id="captcha" />
            <label htmlFor="captcha">No soy un robot</label>
          </div>
          <button type="submit" className="search-button">Buscar</button>
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;
