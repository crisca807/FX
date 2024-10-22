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
import { useWebSocketDelay } from '../../Pages/Context/WebSocketContextDelay'; // Usar el contexto de WebSocket

// Registrar los elementos básicos de ChartJS y el plugin de zoom y anotaciones
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, annotationPlugin, zoomPlugin);

const Delaysocket = () => {
  const [error, setError] = useState(null);
  const data1000Ref = useRef(null); // Usar useRef para mantener la referencia de los datos
  const chartRef = useRef(null); // Usar useRef para el componente de la gráfica

  // Acceder al contexto de WebSocket
  const { message } = useWebSocketDelay();

  useEffect(() => {
    if (message && !data1000Ref.current) { // Solo actualizar si no tenemos los datos previos en la referencia
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

      // Extraer la información de datos_grafico_moneda_mercado
      const result = parsedMessage?.result?.[0];
      const datosGraficoString = result?.datos_grafico_moneda_mercado;

      if (!datosGraficoString) {
        console.error('No se pudo acceder a datos_grafico_moneda_mercado:', result);
        return;
      }

      // Extraer los datos relevantes desde el string de datos
      const preciosCierreMatch = datosGraficoString.match(/Precios de cierre',data:\s*\[([0-9.,\s]+)\]/);
      const montosUSDMatch = datosGraficoString.match(/Montos \(Miles USD\)',data:\s*\[([0-9.,\s]+)\]/);
      const labelsMatch = datosGraficoString.match(/labels:\s*\[([0-9:,\s]+)\]/);

      const preciosCierre = preciosCierreMatch ? preciosCierreMatch[1].split(',').map(Number) : [];
      const montosUSD = montosUSDMatch ? montosUSDMatch[1].split(',').map(Number) : [];
      const labels = labelsMatch ? labelsMatch[1].split(',') : [];

      // Guardar los datos en el useRef para evitar actualizar cada vez que llega un nuevo mensaje
      data1000Ref.current = {
        preciosCierre,
        montosUSD,
        labels,
      };
    }
  }, [message]); // Este efecto solo se ejecutará cuando 'message' cambie

  const calcularPromedio = (data) => {
    const total = data.reduce((acc, val) => acc + val, 0);
    return total / data.length;
  };

  const renderChart = () => {
    const data1000 = data1000Ref.current;

    if (!data1000) {
      return <p>No se recibieron datos para el ID 1000 y mercado 71.</p>;
    }

    const { preciosCierre, montosUSD, labels } = data1000;
    const precioInicial = preciosCierre.length > 0 ? preciosCierre[0] : 0; // Primer precio de cierre del día
    const promedioCierre = calcularPromedio(preciosCierre);

    // Crear el degradado en el contexto de canvas para difuminar el cambio entre blanco, rojo y azul
    const createGradient = (ctx, area) => {
      const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
      // Ajustar el degradado para que el rojo y el azul se vean más estéticos
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Blanco en el eje X

      // Transición suave del blanco al rojo
      gradient.addColorStop(0.5, 'rgba(255, 120, 120, 0.6)'); // Rojo suave
      gradient.addColorStop(0.4, 'rgba(255, 120, 120, 0.8)'); // Rojo más claro

      // Transición suave del rojo al azul
      gradient.addColorStop(0.6, 'rgba(157, 212, 255, 0.6)'); // Comienza el azul suave
      gradient.addColorStop(1, 'rgba(0, 123, 255, 0.8)'); // Azul vibrante en la parte superior

      return gradient;
    };

    const data = {
      labels: labels, // No se filtran los labels
      datasets: [
        {
          label: 'Precios de cierre',
          data: preciosCierre, // Todos los datos
          fill: 'start', // Llenar el área bajo la línea
          tension: 0, // Línea recta
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
    
            if (!chartArea) {
              // Esto evita problemas cuando la gráfica no ha sido renderizada aún
              return null;
            }
            return createGradient(ctx, chartArea);
          },
          // Colores de las líneas (rojo y azul) con un toque estético
          borderColor: (context) => {
            const { dataIndex, dataset } = context;
            return dataset.data[dataIndex] > precioInicial ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 0, 0, 0.9)'; // Azul más vibrante si subió, rojo suave si bajó
          },
          borderWidth: 2.1, // Aquí defines el grosor de la línea. Puedes ajustar el valor (por ejemplo, 2 o 0.5 para cambiar el grosor)
          // Colores del área debajo de las líneas (relleno con gradiente)
          segment: {
            borderColor: ctx => (ctx.p0.parsed.y > precioInicial ? 'rgba(0, 123, 255, 0.6)' : 'rgba(255, 0, 0, 0.6)'), // Azul vibrante por encima de la línea, rojo suave por debajo
          },
          pointRadius: 0, // Sin puntos
          yAxisID: 'y',
        },
        {
          label: 'Montos (Miles USD)',
          data: montosUSD,
          backgroundColor: 'rgba(158, 147, 147, 0.4)', // Estilo básico sin colores personalizados
          yAxisID: 'y1',
          type: 'bar',
          barThickness: 2,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false, // Deshabilitar la relación de aspecto predeterminada
      aspectRatio: 3, // Ajustar la relación de aspecto para hacer la gráfica más ancha
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
              size: 14, // Reducir el tamaño de la fuente
              family: 'Roboto, sans-serif', // Cambiar a "Roboto" o la fuente que prefieras
              weight: 'normal', // Sin negrita
            },
            color: '#000000',
          },
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              scaleID: 'y',
              value: precioInicial, // Primer precio del día
              borderColor: 'rgba(0, 0, 0, 0.3)', // Color de la línea horizontal
              borderWidth: 0.5, // Grosor de la línea
              borderDash: [5, 5], // Cambiar a línea de puntos
              label: {
                enabled: true,
                content: `Precio Inicial: $${precioInicial.toFixed(2)}`, // Texto para la etiqueta
                position: 'end', // Posición al final de la línea
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
              size: 14, // Reducir tamaño de la fuente
              family: 'Roboto, sans-serif', // Fuente personalizada para el eje X
              weight: 'normal', // Sin negrita
            },
            callback: function(value, index, values) {
              // Mostrar los datos cada 1 hora (cada 60 ticks en el array de labels)
              if (index % 120 === 0) {
                return labels[index];
              }
            },
            maxRotation: 0,
            minRotation: 0, // Para mostrar las etiquetas de forma horizontal
          },
          grid: {
            display: false, // Ocultar la cuadrícula en el eje X
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: {
            display: false, // Ocultar la cuadrícula en el eje Y
          },
          ticks: {
            font: {
              size: 14, // Reducir tamaño de la fuente en el eje Y
              family: 'Roboto, sans-serif', // Fuente personalizada para el eje Y
            },
          },
          suggestedMax: precioInicial + 5, // Añadir un margen superior para bajar la línea
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            display: false, // Ocultar la cuadrícula en el eje Y1
          },
          ticks: {
            stepSize: 1000, // Ajustar el paso de los ticks a 1000 en 1000
            font: {
              size: 14, // Reducir tamaño de la fuente en el eje Y1
              family: 'Roboto, sans-serif', // Fuente personalizada para el eje Y1
            },
          },
        },
      },
    };

    return <Line ref={chartRef} data={data} options={options} />;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> {/* Este contenedor centrará la gráfica */}
      <div className="dolar-spot-socket" style={{ backgroundColor: 'white', color: 'black', padding: '20px', width: '100%', maxWidth: '1800px', height: '700px' }}>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <div style={{ width: '100%', height: '100%' }}>
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default Delaysocket;
