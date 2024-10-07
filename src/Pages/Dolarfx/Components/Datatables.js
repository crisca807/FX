import React from 'react';
import Mount from './Mount.js';
import UniqueTrm from '../Components/TrmReal.js';

import '../styles/datatables.css'; // Importa el archivo CSS

const DataTables = () => {
  return (
    <div className="Tables-container">
      {/* Ambas tablas mostradas al mismo tiempo */}
      <div className="tab-content">
        <UniqueTrm />
      </div>
      <div className="tab-content">
        <Mount />
      </div>
    </div>
  );
};

export default DataTables;
