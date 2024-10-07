import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TokenService from '../../Services/Tokenservice'; // Importa el singleton
import '../styled/login.css';
import logo from '../../../Assets/Images/set icap.png';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Inicializa useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();

    // Llama a TokenService para obtener el token
    const token = await TokenService.fetchToken(username, password);

    if (token) {
      // Redirige a init y pasa el token en el estado
      navigate('/init', { state: { token } });
    } else {
      setError('No autorizado');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" />
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username*</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña*</label>
            <input
              type="password"
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="submit-button">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
