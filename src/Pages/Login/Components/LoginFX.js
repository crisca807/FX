import React from 'react';
import '../styled/login.css';
import logo from '../../../Assets/Images/set icap.png'; // Asegúrate de que esta ruta sea correcta

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
          <button
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
