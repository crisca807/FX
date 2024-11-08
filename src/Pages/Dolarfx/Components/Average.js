import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../Context/Websocketcontext';
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
import '../styles/Average.css';

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
  const { message, error } = useWebSocket();

  // Estado inicial que carga los datos de localStorage o un objeto vacío como fallback
  const [data1002, setData1002] = useState(() => {
    const storedData = localStorage.getItem('webSocketMessage_1002');
    return storedData
      ? JSON.parse(storedData)
      : { usdCopPrices: [], mediaMovil8: [], mediaMovil13: [], labels: [] };
  });

  useEffect(() => {
    if (!data1002 || (data1002.labels && data1002.labels.length === 0)) {
      // Intentar cargar datos de localStorage en caso de que no haya datos iniciales
      const storedData = localStorage.getItem('webSocketMessage_1002');
      if (storedData) {
        setData1002(JSON.parse(storedData));
      } else {
        console.warn("No se encontraron datos previos en 'localStorage'.");
      }
    }
  }, [data1002]);

  useEffect(() => {
    if (message) {
      let parsedMessage;
      try {
        parsedMessage = JSON5.parse(message);
      } catch (e) {
        console.error('Error parsing JSON5:', e.message);
        return;
      }

      if (parsedMessage?.id === 1002 && parsedMessage?.market === 71) {
        const rawData = parsedMessage?.data?.data;
        const nestedData = rawData?.data;

        if (nestedData && nestedData.datasets && nestedData.labels) {
          const usdCopPrices = nestedData.datasets[0]?.data || [];
          const mediaMovil8 = nestedData.datasets[1]?.data || [];
          const mediaMovil13 = nestedData.datasets[2]?.data || [];
          const labels = nestedData.labels || [];

          const newData = {
            usdCopPrices,
            mediaMovil8,
            mediaMovil13,
            labels,
          };

          setData1002(newData);
          localStorage.setItem('webSocketMessage_1002', JSON.stringify(newData));
        } else {
          console.error('No se pudo acceder a datasets o labels en nestedData:', nestedData);
        }
      }
    }
  }, [message]);

  // Configuración de los datos para el gráfico, verificando que los datos existan
  const chartData = {
    labels: data1002.labels || [],
    datasets: [
      {
        label: 'Cotización USD/COP',
        data: data1002.usdCopPrices || [],
        borderColor: '#00a1ff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Media móvil (8)',
        data: data1002.mediaMovil8 || [],
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
      },
      {
        label: 'Media móvil (13)',
        data: data1002.mediaMovil13 || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
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
            size: 14,
            weight: 'bold',
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
            size: 16,
            weight: 'bold',
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Precios (USD/COP)',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          stepSize: 5,
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
        {data1002.labels && data1002.labels.length > 0 ? (
          <div className="unique-data-container">
            <h1>Datos Promedios (ID 1002, Market 71)</h1>
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p>No hay datos disponibles. Mostrando datos anteriores de localStorage si están disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Average;
