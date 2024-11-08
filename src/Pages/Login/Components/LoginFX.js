import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import TokenService from '../../Services/Tokenservice';
import '../styled/login.css';
import logo from '../../../Assets/Images/set icap.png';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaVerified) {
      setError('Por favor, completa el captcha');
      return;
    }

    const token = await TokenService.fetchToken(username, password);

    if (token) {
      navigate('/init', { state: { token } });
    } else {
      setError('No autorizado');
    }
  };

  const onCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  return (
    <div className="login-page">
      <img src={logo} alt="Logo" className="logo-top" />
      <div className="login-container">
        <h2>Inicie sesión con el correo electrónico</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Nombre de usuario o correo electrónico</label>
            <input
              type="text"
              id="username"
              placeholder="Nombre de usuario o correo electrónico"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}

          <div className="forgot-password">
            <a href="/Reset">Olvidé la contraseña o no puedo iniciar sesión</a>
          </div>

          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Recuérdame</label>
          </div>

          <div className="captcha-container">
            <ReCAPTCHA
              sitekey="6Lc4NXkqAAAAAGY6mBnFH0MlQ_eRsbBV7p3xFQzW"
              onChange={onCaptchaChange}
            />
          </div>

          <button type="submit" className="submit-button">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
