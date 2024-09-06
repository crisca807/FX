import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styled/Registerform.css'; // Importa useNavigate
import { registerUser } from '../../Services/Axiouser'; // Asegúrate de la ruta correcta
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); // Inicializa useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();

    // Llama a registerUser con los datos ingresados
    const result = await registerUser(username, password, email, displayName);

    // Verifica si result es un objeto válido y tiene la propiedad success
    if (result && result.success) {
      setMessage(result.message);
      setError(''); // Limpiar el mensaje de error
      // Redirige al usuario a /login después de un registro exitoso
      navigate('/login');
    } else {
      setError(result?.error || 'Error desconocido');
      setMessage(''); // Limpiar el mensaje de éxito

      // Redirige al usuario a /login si el error no es el específico 409
      if (result?.error !== 'El usuario ya existe.') {
        navigate('/login');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '300px' }}>
        <h2 className="text-center">Registro de Usuario</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Nombre de Usuario*</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña*</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash-fill"></i> // Ícono de ocultar
                ) : (
                  <i className="bi bi-eye-fill"></i> // Ícono de mostrar
                )}
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico*</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="displayName" className="form-label">Nombre para Mostrar*</label>
            <input
              type="text"
              className="form-control"
              id="displayName"
              placeholder="Nombre para Mostrar"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          {message && <p className="text-success">{message}</p>}
          <button type="submit" className="btn btn-primary w-100">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
