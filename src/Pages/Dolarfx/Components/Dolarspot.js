import React, { useEffect, useState, useRef } from 'react';
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
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useWebSocket } from '../../Context/Websocketcontext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, annotationPlugin, zoomPlugin);

const DolarSpot = () => {
  const [error, setError] = useState(null);
  const data1000Ref = useRef(null);
  const chartRef = useRef(null);

  const { isConnected, message } = useWebSocket();

  useEffect(() => {
    if (message && !data1000Ref.current) {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (e) {
        console.error('Error al parsear JSON:', e.message);
        return;
      }

      if (parsedMessage?.id !== 1000 || parsedMessage?.market !== 71) {
        return;
      }

      const result = parsedMessage?.result?.[0];
      const datosGraficoString = result?.datos_grafico_moneda_mercado_rt;

      if (!datosGraficoString) {
        console.error('No se pudo acceder a datos_grafico_moneda_mercado_rt:', result);
        return;
      }

      const preciosCierreMatch = datosGraficoString.match(/Precios de cierre',data:\s*\[([0-9.,\s]+)\]/);
      const montosUSDMatch = datosGraficoString.match(/Montos \(Miles USD\)',data:\s*\[([0-9.,\s]+)\]/);
      const labelsMatch = datosGraficoString.match(/labels:\s*\[([0-9:,\s]+)\]/);

      const preciosCierre = preciosCierreMatch ? preciosCierreMatch[1].split(',').map(Number) : [];
      const montosUSD = montosUSDMatch ? montosUSDMatch[1].split(',').map(Number) : [];
      const labels = labelsMatch ? labelsMatch[1].split(',') : [];

      data1000Ref.current = {
        preciosCierre,
        montosUSD,
        labels,
      };
    }
  }, [message]);

  const calcularPromedio = (data) => {
    const total = data.reduce((acc, val) => acc + val, 0);
    return total / data.length;
  };

  const createGradient = (ctx, area, precioInicial, preciosCierre) => {
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

    const maxPrecio = Math.max(...preciosCierre);
    const minPrecio = Math.min(...preciosCierre);
    const relativeStart = (precioInicial - minPrecio) / (maxPrecio - minPrecio);

    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(relativeStart, 'rgba(255, 120, 120, 0.6)');
    gradient.addColorStop(relativeStart - 0.1, 'rgba(255, 120, 120, 0.8)');
    gradient.addColorStop(relativeStart + 0.1, 'rgba(157, 212, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 123, 255, 0.8)');

    return gradient;
  };

  const renderChart = () => {
    const data1000 = data1000Ref.current;

    if (!data1000) {
      return <p>No se recibieron datos para el ID 1000 y mercado 71.</p>;
    }

    const { preciosCierre, montosUSD, labels } = data1000;
    const precioInicial = preciosCierre.length > 0 ? preciosCierre[0] : 0;
    const promedioCierre = calcularPromedio(preciosCierre);

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Precios de cierre',
          data: preciosCierre,
          fill: 'start',
          tension: 0,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            if (!chartArea) {
              return null;
            }
            return createGradient(ctx, chartArea, precioInicial, preciosCierre);
          },
          borderColor: (context) => {
            const { dataIndex, dataset } = context;
            return dataset.data[dataIndex] > precioInicial ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 0, 0, 0.9)';
          },
          borderWidth: 2.1,
          segment: {
            borderColor: ctx => (ctx.p0.parsed.y > precioInicial ? 'rgba(0, 123, 255, 0.6)' : 'rgba(255, 0, 0, 0.6)'),
          },
          pointRadius: 0,
          yAxisID: 'y',
        },
        {
          label: 'Montos (Miles USD)',
          data: montosUSD,
          backgroundColor: 'rgba(158, 147, 147, 0.4)',
          yAxisID: 'y1',
          type: 'bar',
          barThickness: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 3,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      animation: false,
      stacked: false,
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
          },
          zoom: {
            enabled: true,
            mode: 'x',
            speed: 0.05,
          },
        },
        legend: {
          display: true,
          labels: {
            font: {
              size: 16, // Aumentar tamaño de "Precios de cierre" y "Montos (Miles USD)"
              family: 'Poppins, sans-serif',
              weight: 'bold',
            },
            color: '#000000',
          },
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              scaleID: 'y',
              value: precioInicial,
              borderColor: 'rgba(0, 0, 0, 0.3)',
              borderWidth: 0.5,
              borderDash: [5, 5],
              label: {
                enabled: true,
                content: `Precio Inicial: $${precioInicial.toFixed(2)}`,
                position: 'end',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                color: 'white',
                font: {
                  size: 12,
                  family: 'Arial, sans-serif',
                },
              },
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 14,
              family: 'Poppins, sans-serif',
              weight: 'normal',
            },
            callback: function(value, index, values) {
              if (index % 120 === 0) {
                return labels[index];
              }
            },
            maxRotation: 0,
            minRotation: 0,
          },
          grid: {
            display: false,
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 14,
              family: 'Poppins, sans-serif',
            },
          },
          suggestedMax: precioInicial + 5,
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            display: false,
          },
          ticks: {
            stepSize: 1000,
            font: {
              size: 14,
              family: 'Poppins, sans-serif',
            },
          },
        },
      },
    };

    return <Line ref={chartRef} data={data} options={options} />;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="dolar-spot-socket" style={{ backgroundColor: 'white', color: 'black', padding: '20px', width: '100%', maxWidth: '1800px', height: '700px' }}>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <div style={{ width: '100%', height: '100%' }}>
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default DolarSpot;
