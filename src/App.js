import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import Dolarsocket from './Pages/Dolarfx/Components/Dolarsocket';
import Average from './Pages/Dolarfx/Components/Average';
import LoginForm from './Pages/Login/Components/LoginFX';
import RegistroForm from './Pages/Login/Components/RegisterForm';
import Home from './Pages/Home/Home';
import DolarInfo from './Pages/Dolarfx/Components/Dolarrest';
import Init from './Pages/Dolarfx/Init';
import Trm from './Pages/Dolarfx/Components/TrmReal';
import Mount from './Pages/Dolarfx/Components/Mount';
import DolarSpot from './Pages/Dolarfx/Components/Dolarspot';
import Price from './Pages/Dolarfx/Components/Price'; // Importa el componente Price
import CandleData from './Pages/Dolarfx/Components/Candle'; // Importa el componente CandleData
import Bollinger from './Pages/Dolarfx/Components/Bollinger'; // Importa el componente Bollinger
import NewsComponent from './Pages/Dolarfx/Components/newscomponent';
import DelayComponent from './Pages/Delay/delaysocket';

// Import authentication context if needed
import { AuthProvider } from './Pages/Context/tokencontext';
import { WebSocketProvider } from '../src/Pages/Context/Websocketcontext'; // Importa el WebSocketProvider

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider> {/* Contexto correcto del WebSocket */}
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} /> {/* Página principal */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegistroForm />} />
              <Route path="/init" element={<Init />} />
              <Route path="/Trm" element={<Trm />} />
              <Route path="/Mount" element={<Mount />} />
              <Route path="/connection-status" element={<Dolarsocket />} />
              <Route path="/dolar-info" element={<DolarInfo />} /> {/* Ruta para DolarInfo */}
              <Route path="/dolar-spot" element={<DolarSpot />} /> {/* Ruta para DolarSpot */}
              <Route path="/Average" element={<Average />} /> {/* Ruta para Promedio */}
              <Route path="/price" element={<Price />} /> {/* Ruta para Price */}
              <Route path="/candle" element={<CandleData />} /> {/* Nueva ruta para CandleData */}
              <Route path="/bollinger" element={<Bollinger />} /> {/* Nueva ruta para Bollinger */}
              <Route path="/news" element={<NewsComponent />} /> {/* Nueva ruta para NewsComponent */}
              <Route path="/delay" element={<DelayComponent />} /> {/* Nueva ruta para DelayComponent */}
            </Routes>
          </div>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
