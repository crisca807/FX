import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connectWebSocket } from '../../Services/Websocketservice';
import JSON5 from 'json5';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/Average.css'; // Archivo CSS para estilo

// Registramos componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Average = () => {
  const [status, setStatus] = useState('Checking connection...');
  const [error, setError] = useState(null);
  const [data1002, setData1002] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setStatus('Obtaining token...');
        const token = location.state?.token;

        if (token) {
          setStatus('Connecting to WebSocket...');

          // Conectar al WebSocket
          await connectWebSocket(token, (message) => {
            let parsedMessage;
            try {
              parsedMessage = JSON5.parse(message);
            } catch (e) {
              console.error('Error parsing JSON5:', e.message);
              return;
            }

            if (parsedMessage?.id === 1002 && parsedMessage?.market === 71) {
              console.log("Mensaje recibido y filtrado (id 1002):", parsedMessage);

              const rawData = parsedMessage?.data?.data;
              const nestedData = rawData?.data;

              if (nestedData && nestedData.datasets && nestedData.labels) {
                const usdCopPrices = nestedData.datasets[0]?.data || ['Data not available'];
                const mediaMovil8 = nestedData.datasets[1]?.data || ['Data not available'];
                const mediaMovil13 = nestedData.datasets[2]?.data || ['Data not available'];
                const labels = nestedData.labels || ['Labels not available'];

                console.log("Precios USD/COP:", usdCopPrices);
                console.log("Media móvil (8):", mediaMovil8);
                console.log("Media móvil (13):", mediaMovil13);
                console.log("Etiquetas de tiempo:", labels);

                setData1002({
                  usdCopPrices,
                  mediaMovil8,
                  mediaMovil13,
                  labels,
                });
              } else {
                console.error('No se pudo acceder a datasets o labels en nestedData:', nestedData);
              }
            }
          });

          setStatus('Connection successful!');
        } else {
          setStatus('No token provided');
          setData1002(null);
        }
      } catch (err) {
        setStatus('Connection failed');
        setError('An error occurred: ' + err.message);
      }
    };

    checkConnection();
  }, [location.state?.token]);

  const chartData = {
    labels: data1002?.labels || [],
    datasets: [
      {
        label: 'Cotización USD/COP',
        data: data1002?.usdCopPrices || [],
        borderColor: '#007bff',
        pointBackgroundColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.6)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Media móvil (8)',
        data: data1002?.mediaMovil8 || [],
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
      },
      {
        label: 'Media móvil (13)',
        data: data1002?.mediaMovil13 || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 3,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 14, // Cambia el tamaño de la fuente de la leyenda
            weight: 'bold', // Pone la leyenda en negrita
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Etiquetas de tiempo',
          font: {
            size: 16, // Aumenta el tamaño del título del eje X
            weight: 'bold', // Pone en negrita el título del eje X
          },
        },
        ticks: {
          font: {
            size: 14, // Aumenta el tamaño de la fuente en el eje X
            // Pone en negrita los valores del eje X
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Precios (USD/COP)',
          font: {
            size: 16, // Aumenta el tamaño del título del eje Y
            weight: 'bold', // Pone en negrita el título del eje Y
          },
        },
        ticks: {
          font: {
            size: 14, // Aumenta el tamaño de la fuente en el eje Y
            // Pone en negrita los valores del eje Y
          },
          stepSize: 5,
          precision: 0,
          min: 4140,
          max: 4200,
        },
      },
    },
  };

  return (
    <div className="promedio-dolar-informacion">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {location.state?.token ? (
          data1002 ? (
            <div className="unique-data-container">
              <h1>Datos Promedios (ID 1002, Market 71)</h1>
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p>No data received for ID 1002 and market 71.</p>
          )
        ) : (
          <p>No token available to fetch data.</p>
        )}
      </div>
    </div>
  );
};

export default Average;
