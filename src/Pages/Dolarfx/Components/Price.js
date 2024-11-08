import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useWebSocket } from '../../Context/Websocketcontext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Price = () => {
  // Cargar datos almacenados de localStorage al inicializar el estado
  const [data1001, setData1001] = useState(() => {
    const storedData = localStorage.getItem('webSocketMessage_1001');
    return storedData ? JSON.parse(storedData) : null;
  });
  const { message, error } = useWebSocket();

  useEffect(() => {
    // Si hay datos en localStorage y aún no se han cargado en el estado, establecerlos
    if (!data1001) {
      const storedData = localStorage.getItem('webSocketMessage_1001');
      if (storedData) {
        setData1001(JSON.parse(storedData));
      }
    }
  }, []);

  useEffect(() => {
    if (message) {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (e) {
        console.error('Error al parsear JSON:', e.message);
        return;
      }

      // Filtrar mensajes para ID 1001 y market 71
      if (parsedMessage?.id === 1001 && parsedMessage?.market === 71) {
        const result = parsedMessage?.data?.data?.data;

        if (!result || !result.datasets || !Array.isArray(result.datasets)) {
          console.error('No se encontraron datasets dentro de `data`: ', result?.datasets);
          return;
        }

        if (!result.labels || !Array.isArray(result.labels)) {
          console.error('No se encontraron labels dentro de `data`:', result.labels);
          return;
        }

        const cotizacion = result.datasets[0]?.data || [];
        const labels = result.labels || [];

        if (cotizacion.length === 0 || labels.length === 0) {
          console.error('No se encontraron datos o etiquetas válidas.');
          return;
        }

        // Actualizar el estado y almacenar los datos en localStorage
        const newData = { cotizacion, labels };
        setData1001(newData);
        localStorage.setItem('webSocketMessage_1001', JSON.stringify(newData));
      }
    }
  }, [message]);

  const renderChart = () => {
    if (!data1001) {
      return <p>No se recibieron datos para el ID 1001 y mercado 71.</p>;
    }

    const { cotizacion, labels } = data1001;

    const createGradient = (ctx, chartArea) => {
      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Blanco en la parte inferior
      gradient.addColorStop(1, 'rgba(135, 206, 235, 1)'); // Azul cielo en la parte superior
      return gradient;
    };

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Cotización USD/COP',
          data: cotizacion,
          borderColor: '#00a1ff',
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const { ctx: context, chartArea } = chart;

            if (!chartArea) {
              return null;
            }
            return createGradient(context, chartArea);
          },
          borderWidth: 2,
          fill: true,
          tension: 0,
          pointRadius: 0
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Cotización USD/COP'
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 20,
            font: {
              size: 14,
              family: 'Arial, sans-serif',
              weight: 'normal',
            },
          }
        },
        y: {
          display: true,
          beginAtZero: false,
          grid: {
            color: 'rgba(0, 0, 0, 0.2)'
          },
          ticks: {
            font: {
              size: 14,
              family: 'Arial, sans-serif',
              weight: 'normal',
            },
            callback: function(value) {
              return value.toFixed(0);
            }
          }
        }
      }
    };

    return <Line data={data} options={options} height={491} />;
  };

  return (
    <div className="price-information" style={{ backgroundColor: 'white', color: 'black', padding: '20px', maxWidth: '1420px', height: '570px', margin: '0 auto' }}>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {renderChart()}
      </div>
    </div>
  );
};

export default Price;
