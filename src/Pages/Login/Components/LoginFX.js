import React from 'react';
import '../styled/login.css';
import logo from '../../../Assets/Images/set icap.png'; // Make sure to replace this with the correct path to your logo image

const LoginForm = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" />
        <form>
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input type="email" id="email" placeholder="Email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña*</label>
            <input type="password" id="password" placeholder="Contraseña" required />
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
