import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useWebSocket } from '../../Context/Websocketcontext'; // Importa el contexto de WebSocket
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

// Registrar los componentes necesarios para la gráfica
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Price = () => {
  const [data1001, setData1001] = useState(null);
  const { isConnected, message, error } = useWebSocket(); // Usar el contexto de WebSocket

  useEffect(() => {
    if (message) {
      console.log('Mensaje recibido en el componente:', message);

      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
        console.log('Mensaje JSON.parseado completo:', parsedMessage);
      } catch (e) {
        console.error('Error al parsear JSON:', e.message);
        return;
      }

      if (parsedMessage?.id !== 1001 || parsedMessage?.market !== 71) {
        console.log('El mensaje recibido no es para el ID 1001 o el mercado 71.');
        return;
      }

      const result = parsedMessage?.data?.data?.data;
      console.log('Contenido de parsedMessage.data.data.data:', result);

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

      setData1001({
        cotizacion,
        labels,
      });
    }
  }, [message]);

  const renderChart = () => {
    if (!data1001) {
      return <p>No se recibieron datos para el ID 1001 y mercado 71.</p>;
    }

    const { cotizacion, labels } = data1001;

    // Datos para la gráfica
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Cotización USD/COP',
          data: cotizacion,
          borderColor: '#00a1ff',
          backgroundColor: 'rgba(0, 161, 255, 0.2)',  // Fondo degradado debajo de la línea
          borderWidth: 2,
          fill: true,  // Activa el relleno
          tension: 0.5,  // Suaviza más la línea
          pointRadius: 0  // Remueve los puntos en la línea
        }
      ]
    };

    const options = {
      responsive: true,
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
            drawOnChartArea: false  // Elimina las líneas verticales
          },
          ticks: {
            autoSkip: true,  // Auto saltar etiquetas de tiempo para evitar aglomeración
            maxTicksLimit: 20
          }
        },
        y: {
          display: true,
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return value.toFixed(0);  // Eliminar decimales
            }
          }
        }
      }
    };

    return <Line data={data} options={options} />;
  };

  return (
    <div className="price-information" style={{ backgroundColor: 'white', color: 'black', padding: '20px' }}>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {renderChart()}
      </div>
    </div>
  );
};

export default Price;
