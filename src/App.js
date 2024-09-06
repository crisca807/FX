import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa los componentes
import ConnectionStatus from './Pages/Dolarfx/Components/axiosresponse'; 
import CategoryData from './Pages/Dolarfx/Components/Promedio'; 
import { WebSocketProvider } from './Pages/Context/WebSocketContext'; 
import LoginForm from './Pages/Login/Components/LoginFX'; 
import RegistroForm from './Pages/Login/Components/RegisterForm'; 
import Home from './Pages/Dolarfx/Home'; 
import DolarInfo from './Pages/Dolarfx/Components/Dolarrest'; 
import Init from './Pages/Dolarfx/Init';

// Importa el contexto de autenticación si es necesario
import { AuthProvider } from './Pages/Context/tokencontext'; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <Router>
      <AuthProvider> {/* Envuelve la aplicación con AuthProvider */}
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Página principal */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistroForm />} />
            <Route path="/init" element={<Init />} />
            <Route path="/connection-status" element={
              <WebSocketProvider>
                <ConnectionStatus />
              </WebSocketProvider>
            } />
            <Route path="/category-data" element={
              <WebSocketProvider>
                <div>
                  <CategoryData category="promedio" />
                  <CategoryData category="cierre" />
                </div>
              </WebSocketProvider>
            } />
            <Route path="/dolar-info" element={<DolarInfo />} /> {/* Ruta para DolarInfo */}
          </Routes>
        </div>
      </AuthProvider> {/* Cierra el AuthProvider */}
    </Router>
  );
}

export default App;
