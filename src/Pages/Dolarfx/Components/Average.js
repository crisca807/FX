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

  // Estado inicial para almacenar datos de la gráfica
  const [data1002, setData1002] = useState(() => {
    const storedData = localStorage.getItem('webSocketMessage_1002_1M');
    return storedData
      ? JSON.parse(storedData)
      : { usdCopPrices: [], mediaMovil8: [], mediaMovil13: [], labels: [] };
  });

  // Estado para el lapse seleccionado
  const [selectedLapse, setSelectedLapse] = useState("1M");

  useEffect(() => {
    // Cargar datos de localStorage específicos para el lapse seleccionado
    const storedData = localStorage.getItem(`webSocketMessage_1002_${selectedLapse}`);
    if (storedData) {
      setData1002(JSON.parse(storedData));
    } else {
      // Si no hay datos en localStorage, limpiar el estado
      setData1002({ usdCopPrices: [], mediaMovil8: [], mediaMovil13: [], labels: [] });
    }
  }, [selectedLapse]);

  useEffect(() => {
    if (message) {
      let parsedMessage;
      try {
        parsedMessage = JSON5.parse(message);
      } catch (e) {
        console.error('Error parsing JSON5:', e.message);
        return;
      }

      // Filtrar solo los mensajes con id 1002, market 71 y lapse seleccionado
      if (
        parsedMessage?.id === 1002 &&
        parsedMessage?.market === 71 &&
        parsedMessage?.lapse === selectedLapse
      ) {
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
          localStorage.setItem(`webSocketMessage_1002_${selectedLapse}`, JSON.stringify(newData));
        } else {
          console.error('No se pudo acceder a datasets o labels en nestedData:', nestedData);
        }
      }
    }
  }, [message, selectedLapse]);

  // Crear gradiente para el área de fondo
  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Color blanco en la parte inferior
    gradient.addColorStop(1, 'rgba(0, 123, 255, 0.3)'); // Azul claro con opacidad en la parte superior
    return gradient;
  };

  // Configuración de los datos para el gráfico, verificando que los datos existan
  const chartData = {
    labels: data1002.labels || [],
    datasets: [
      {
        label: 'Cotización USD/COP',
        data: data1002.usdCopPrices || [],
        borderColor: 'rgba(0, 123, 255, 0.9)', // Color de la línea
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: chartContext, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          return createGradient(chartContext, chartArea); // Uso del gradiente para el área de fondo
        },
        fill: true,
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'Media móvil (8)',
        data: data1002.mediaMovil8 || [],
        borderColor: 'rgba(54, 162, 235, 0.9)',
        fill: false,
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 1.5,
      },
      {
        label: 'Media móvil (13)',
        data: data1002.mediaMovil13 || [],
        borderColor: 'rgba(255, 99, 132, 0.9)',
        fill: false,
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 1.5,
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
            family: 'Poppins',
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
            family: 'Poppins',
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 7, // Limita a 7 etiquetas en el eje X
          font: {
            family: 'Poppins',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Precios (USD/COP)',
          font: {
            size: 16,
            weight: 'bold',
            family: 'Poppins',
          },
        },
        ticks: {
          maxTicksLimit: 8, // Limita a 8 etiquetas en el eje Y
          font: {
            family: 'Poppins',
          },
          stepSize: 5,
          min: 4140,
          max: 4200,
        },
      },
    },
  };

  // Función para cambiar el lapse seleccionado
  const handleLapseChange = (lapse) => {
    setSelectedLapse(lapse);
  };

  return (
    <div className="promedio-dolar-informacion">
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {['1D', '5D', '1M', '6M', '1A'].map((lapse) => (
          <button
            key={lapse}
            onClick={() => handleLapseChange(lapse)}
            style={{
              padding: '10px 20px',
              margin: '0 5px',
              backgroundColor: lapse === selectedLapse ? '#003366' : '#336699',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {lapse}
          </button>
        ))}
      </div>
      <div>
        {data1002.labels && data1002.labels.length > 0 ? (
          <div className="unique-data-container">
            <h1>Datos Promedios (ID 1002, Market 71)</h1>
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p>No hay datos disponibles para {selectedLapse}. Mostrando datos anteriores de localStorage si están disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Average;
