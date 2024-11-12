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
  const [data1001, setData1001] = useState(null);
  const [selectedLapse, setSelectedLapse] = useState("6M"); // Estado para el lapse seleccionado
  const { message, error } = useWebSocket();

  useEffect(() => {
    const storedData = localStorage.getItem(`webSocketMessage_1001_${selectedLapse}`);
    if (storedData) {
      setData1001(JSON.parse(storedData));
    }
  }, [selectedLapse]);

  useEffect(() => {
    if (message) {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (e) {
        console.error('Error al parsear JSON:', e.message);
        return;
      }

      console.log("Mensaje recibido:", parsedMessage);
      console.log("Lapse seleccionado:", selectedLapse);
      console.log("Lapse en el mensaje:", parsedMessage?.lapse);

      // Filtrar mensajes para ID 1001, market 71 y el lapse seleccionado (1D, 5D, 1M, 6M o 1A)
      if (
        parsedMessage?.id === 1001 &&
        parsedMessage?.market === 71 &&
        parsedMessage?.lapse === selectedLapse
      ) {
        const result = parsedMessage?.data?.data?.data;

        console.log("Datos resultantes:", result);

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

        console.log("Cotización:", cotizacion);
        console.log("Labels:", labels);

        if (cotizacion.length === 0 || labels.length === 0) {
          console.error('No se encontraron datos o etiquetas válidas.');
          return;
        }

        const newData = { cotizacion, labels };
        setData1001(newData);
        localStorage.setItem(`webSocketMessage_1001_${selectedLapse}`, JSON.stringify(newData));
      } else {
        console.warn("No se encontraron datos para el lapse seleccionado:", selectedLapse);
      }
    }
  }, [message, selectedLapse]);

  const renderChart = () => {
    if (!data1001 || !data1001.cotizacion || !data1001.labels) {
      return <p>No se recibieron datos para el ID 1001, mercado 71 y lapse {selectedLapse}.</p>;
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
          label: `Cotización USD/COP (${selectedLapse})`,
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
            maxTicksLimit: 7, // Mostrar solo 7 etiquetas en el eje X
            font: {
              family: 'Poppins', // Fuente Poppins
              size: 12,
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
              family: 'Poppins', // Fuente Poppins
              size: 12,
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

  const handleLapseChange = (lapse) => {
    setSelectedLapse(lapse);
    setData1001(null); // Resetear los datos para que se actualicen con el nuevo lapse seleccionado
  };

  return (
    <div className="price-information" style={{ backgroundColor: 'white', color: 'black', padding: '20px', maxWidth: '1420px', height: '670px', margin: '0 auto' }}>
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
        {renderChart()}
      </div>
    </div>
  );
};

export default Price;
