// src/components/CategoryData.js
import React from 'react';
import { useWebSocket } from '../../Context/WebSocketContext'; // Ajusta la ruta según tu estructura de proyecto

const CategoryData = ({ category }) => {
  const { data } = useWebSocket();

  // Filtrar los datos por la categoría proporcionada
  const filteredData = data[category] || {};

  return (
    <div>
      <h2>Data for Category: {category}</h2>
      {Object.keys(filteredData).length > 0 ? (
        <div>
          <h3>{filteredData.message || 'No Message'}</h3>
          <pre>{JSON.stringify(filteredData, null, 2)}</pre>
        </div>
      ) : (
        <p>No data for category "{category}".</p>
      )}
    </div>
  );
};

export default CategoryData;
