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
import Price from './Pages/Dolarfx/Components/Price';
import CandleData from './Pages/Dolarfx/Components/Candle';
import Bollinger from './Pages/Dolarfx/Components/Bollinger';
import NewsComponent from './Pages/Dolarfx/Components/newscomponent';
import DelayComponent from './Pages/Delay/delaysocket';
import TrmDelay from './Pages/Delay/Trmdelay';

// Import authentication context if needed
import { AuthProvider } from './Pages/Context/tokencontext';
import { WebSocketProvider } from './Pages/Context/Websocketcontext'; // Importa el WebSocketProvider estándar
import { WebSocketProviderDelay } from './Pages/Context/WebSocketContextDelay'; // Importa el WebSocketProvider para delay
import { TokenProviderDelay } from './Pages/Context/tokencontextdelay'; // Importa el TokenProviderDelay para manejar el token

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Rutas que necesitan TokenProviderDelay */}

            <WebSocketProviderDelay>
              <Routes>
                <Route path="/" element={<Home />} /> {/* Página principal usando TokenProviderDelay y WebSocketProviderDelay */}
              <Route path="/delay" element={<DelayComponent />} /> {/* Ruta para DelayComponent */}
              <Route path="/Trmdelay" element={<TrmDelay />} /> {/* Ruta para DelayComponent */}
              
              </Routes>
            </WebSocketProviderDelay>


          {/* Rutas que usan solo el WebSocketProvider estándar */}
          <TokenProviderDelay>
          <WebSocketProvider>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegistroForm />} />
              <Route path="/init" element={<Init />} />
              <Route path="/Trm" element={<Trm />} />
              <Route path="/Mount" element={<Mount />} />
              <Route path="/connection-status" element={<Dolarsocket />} />
              <Route path="/dolar-info" element={<DolarInfo />} />
              <Route path="/Average" element={<Average />} />
              <Route path="/price" element={<Price />} />
              <Route path="/candle" element={<CandleData />} />
              <Route path="/bollinger" element={<Bollinger />} />
              <Route path="/news" element={<NewsComponent />} />
            </Routes>
          </WebSocketProvider>
           </TokenProviderDelay>

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
