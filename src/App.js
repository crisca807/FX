// App.js
import React from 'react';


import WebSocketConnection from './Pages/Dolarfx/Components/axiosresponse'; // Corregida la ruta

// Inicializa Sentry

function App() {
  return (
    <div className="App">
      < WebSocketConnection/>
    </div>
  );
}

export default App;
