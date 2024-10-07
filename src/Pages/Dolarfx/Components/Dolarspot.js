import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useWebSocket } from '../../Context/Websocketcontext'; // Usar el contexto de WebSocket

// Registrar Filler, BarElement y el plugin de anotación
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, annotationPlugin);

const DolarSpot = () => {
  const [status, setStatus] = useState('Verificando conexión...');
  const [error, setError] = useState(null);
  const [data1000, setData1000] = useState(null);

  // Acceder al contexto de WebSocket
  const { isConnected, message } = useWebSocket();

  useEffect(() => {
    if (message) {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (e) {
        console.error('Error al parsear JSON:', e.message);
        return;
      }

      if (parsedMessage?.id !== 1000 || parsedMessage?.market !== 71) {
        return; // Ignorar mensajes que no sean del ID 1000 o mercado 71
      }

      const result = parsedMessage?.result?.[0];
      if (!result || !result.datos_grafico_moneda_mercado_rt) {
        console.error('No se pudo acceder a datos_grafico_moneda_mercado_rt:', result);
        return;
      }

      const datosGraficoString = result.datos_grafico_moneda_mercado_rt;

      const preciosCierreMatch = datosGraficoString.match(/Precios de cierre',data:\s*\[([0-9.,\s]+)\]/);
      const montosUSDMatch = datosGraficoString.match(/Montos \(Miles USD\)',data:\s*\[([0-9.,\s]+)\]/);
      const labelsMatch = datosGraficoString.match(/labels:\s*\[([0-9:,\s]+)\]/);

      const preciosCierre = preciosCierreMatch ? preciosCierreMatch[1].split(',').map(Number) : [];
      const montosUSD = montosUSDMatch ? montosUSDMatch[1].split(',').map(Number) : [];
      const labels = labelsMatch ? labelsMatch[1].split(',') : [];

      setData1000({
        preciosCierre,
        montosUSD,
        labels,
      });
    }
  }, [message]);

  const calcularPromedio = (data) => {
    const total = data.reduce((acc, val) => acc + val, 0);
    return total / data.length;
  };

  const renderChart = () => {
    if (!data1000) {
      return <p>No se recibieron datos para el ID 1000 y mercado 71.</p>;
    }

    const { preciosCierre, montosUSD, labels } = data1000;
    const precioInicial = preciosCierre.length > 0 ? preciosCierre[0] : 0; // Validación para evitar errores
    const promedioCierre = calcularPromedio(preciosCierre);

    // Ajustar los valores mínimos y máximos para centrar los datos
    const minY = Math.min(...preciosCierre) - 5;
    const maxY = Math.max(...preciosCierre) + 5;

    const minY1 = Math.min(...montosUSD) - 250;  // Ajustar para pegar al eje
    const maxY1 = Math.max(...montosUSD) + 500;

    // Crear el degradado que comienza justo encima de las barras
    const getBarGradient = (ctx, chartArea) => {
      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top); // De abajo (gris) hacia arriba (blanco)
      gradient.addColorStop(0, 'rgba(194, 194, 194, 1)'); // Gris en la parte inferior
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.7)'); // Blanco con opacidad encima de las barras
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Totalmente transparente en la parte superior
      return gradient;
    };

    const data = {
      labels: labels.slice(0, preciosCierre.length),
      datasets: [
        {
          label: 'Precios de cierre',
          data: preciosCierre,
          borderColor: '#00a1ff',
          fill: true,
          tension: 0.0,
          pointRadius: 0,
          yAxisID: 'y',
          type: 'line',
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const { chartArea } = chart;

            if (!chartArea) {
              return null;
            }

            return getBarGradient(ctx.chart.ctx, chartArea);
          },
          segment: {
            borderColor: (ctx) => (ctx.p0.parsed.y >= precioInicial ? 'rgba(0, 161, 255, 0.8)' : 'rgba(165, 38, 38, 0.8)'), // Azul si es mayor, rojo si es menor
            backgroundColor: (ctx) => (ctx.p0.parsed.y >= precioInicial ? 'rgba(0, 161, 255, 0.1)' : 'rgba(181, 44, 44, 0.1)'), // Cambiar color de fondo
          },
        },
        {
          label: 'Montos (Miles USD)',
          data: montosUSD,
          backgroundColor: 'rgba(194, 194, 194, 1)', // Barras 100% gris
          yAxisID: 'y1',
          type: 'bar',
          barThickness: 3, // Ajustar el grosor de las barras
        },
      ],
    };

    const options = {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      animation: false, // Sin animaciones para la transición de los montos
      stacked: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 18, // Tamaño de la fuente de la leyenda
              family: 'Arial, sans-serif', // Tipografía de la leyenda
            },
            color: '#000000', // Color del texto de la leyenda
            usePointStyle: true, // Cambia la forma de la leyenda a un punto en lugar de una línea
            padding: 20, // Espaciado adicional alrededor de la leyenda
          },
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              scaleID: 'y',
              value: precioInicial, // Primer precio del día
              borderColor: 'rgba(0, 0, 0, 0.5)', // Línea negra con opacidad al 50%
              borderWidth: 2,
              label: {
                content: `$${precioInicial.toFixed(2)}`, // Mostrar el valor exacto al lado de la línea
                enabled: true,
                position: 'start',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                font: {
                  size: 14,
                  family: 'Arial, sans-serif',
                },
                padding: {
                  top: 6,
                  bottom: 6,
                },
                yAdjust: -10, // Ajuste para que la etiqueta no esté directamente sobre la línea
              },
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            font: {
              size: 16,
              family: 'Arial, sans-serif',
            },
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: {
            drawOnChartArea: true,
          },
          min: minY,
          max: maxY,
          ticks: {
            stepSize: (maxY - minY) / 10,  // Divide en 10 segmentos
            callback: (value) => `$${(typeof value === 'number') ? value.toFixed(2) : '0.00'}`, // Validar antes de usar toFixed
            font: {
              size: 16,
              family: 'Arial, sans-serif',
            },
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
          min: minY1,
          max: maxY1,
          ticks: {
            stepSize: (maxY1 - minY1) / 10,  // Divide en 10 segmentos
            callback: (value) => `${(typeof value === 'number') ? value.toFixed(0) : '0'}`, // Validar antes de usar toFixed
            font: {
              size: 16,
              family: 'Arial, sans-serif',
            },
          },
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  return (
    <div className="dolar-spot-informacion" style={{ backgroundColor: 'white', color: 'black', padding: '20px' }}>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        {renderChart()}
      </div>
    </div>
  );
};

export default DolarSpot;
