import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { postDolarInformacion } from '../../Services/apicommercial';
import '../styles/dolar.css'; // Importa el archivo CSS

const DolarInfo = () => {
  const location = useLocation();
  const [error, setError] = useState('');
  const [postData, setPostData] = useState(null);
  const token = location.state?.token;

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const postResponse = await postDolarInformacion(token);

          if (postResponse.success) {
            if (postResponse.data && typeof postResponse.data === 'object') {
              setPostData(postResponse.data);
            } else {
              setError('Datos recibidos no son válidos.');
              alert('Datos recibidos no son válidos.');
            }
          } else {
            setError(postResponse.message || 'No se pudo obtener información de la API comercial.');
            alert(`Error al obtener información: ${postResponse.message}`);
          }
        } catch (err) {
          console.error('Error al hacer la solicitud POST:', err);
          setError('Error desconocido al hacer la solicitud POST.');
          alert('Error desconocido al hacer la solicitud POST.');
        }
      } else {
        
      }
    };

    // Fetch initial data
    fetchData();

    // Set interval to fetch data every 3 seconds
    const intervalId = setInterval(fetchData, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [token]);

  return (
    <div className="dolar-info">
      

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {postData && (
        <div className="data-container">
          <div className="data-box">
            <h2>Promedio</h2>
            <p>{postData.promedio != null ? `$${postData.promedio.toLocaleString('es-AR')}` : 'Datos no disponibles'}</p>
          </div>
          <div className="data-box">
            <h2>Cierre</h2>
            <p>{postData.cierre != null ? `$${postData.cierre.toLocaleString('es-AR')}` : 'Datos no disponibles'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DolarInfo;
