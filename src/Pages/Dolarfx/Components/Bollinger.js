import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../Context/Websocketcontext'; // Importa el contexto de WebSocket
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

// Registrar componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Bollinger = () => {
  const [data1002, setData1002] = useState(null);
  const { message, error } = useWebSocket(); // Usar el contexto de WebSocket sin necesidad de conectar de nuevo

  useEffect(() => {
    if (message) {
      let parsedMessage;
      try {
        parsedMessage = JSON5.parse(message);
      } catch (e) {
        console.error('Error parsing JSON5:', e.message);
        return;
      }

      // Filtrar los mensajes para el ID 1002 y el market 71
      if (parsedMessage?.id === 1002 && parsedMessage?.market === 71) {
        const rawData = parsedMessage?.data?.data;
        const nestedData = rawData?.data;

        if (nestedData && nestedData.datasets && nestedData.labels) {
          const usdCopPrices = nestedData.datasets[0]?.data || ['Data not available'];
          const mediaMovil8 = nestedData.datasets[1]?.data || ['Data not available'];
          const mediaMovil20MenosDesv = nestedData.datasets[2]?.data || ['Data not available'];
          const mediaMovil20MasDesv = nestedData.datasets[3]?.data || ['Data not available'];
          const labels = nestedData.labels || ['Labels not available'];

          setData1002({
            usdCopPrices,
            mediaMovil8,
            mediaMovil20MenosDesv,
            mediaMovil20MasDesv,
            labels,
          });
        }
      }
    }
  }, [message]);

  const chartData = {
    labels: data1002?.labels || [],
    datasets: [
      {
        label: 'Cotización USD/COP',
        data: data1002?.usdCopPrices || [],
        borderColor: '#007bff',
        pointBackgroundColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)', // Relleno bajo la línea
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Media móvil (8)',
        data: data1002?.mediaMovil8 || [],
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
        borderWidth: 2, // Línea más delgada
      },
      {
        label: 'Media móvil (20)-2 Desv Est',
        data: data1002?.mediaMovil20MenosDesv || [],
        borderColor: 'rgba(255, 99, 132, 1)', // Rojo para la línea inferior
        fill: '-1', // Relleno entre esta línea y la línea superior
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Media móvil (20)+2 Desv Est',
        data: data1002?.mediaMovil20MasDesv || [],
        borderColor: 'rgba(0, 0, 0, 1)', // Negro para la línea superior
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
      tooltip: {
        mode: 'index', // Muestra todas las líneas en el tooltip
        intersect: false,
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
          },
          stepSize: 5,
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="promedio-dolar-informacion">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {data1002 ? (
          <div className="unique-data-container">
            <h1>Datos de Bollinger (ID 1002, Market 71)</h1>
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p>No data received for ID 1002 and market 71.</p>
        )}
      </div>
    </div>
  );
};

export default Bollinger;
