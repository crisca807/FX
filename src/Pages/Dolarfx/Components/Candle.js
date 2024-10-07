import React, { useEffect, useState, useRef } from 'react';
import { useWebSocket } from '../../Context/Websocketcontext'; // Usar el contexto de WebSocket
import { Chart, registerables, TimeScale, LinearScale, CategoryScale } from 'chart.js';
import { CandlestickController, OhlcController, CandlestickElement, OhlcElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

// Registrar los controladores necesarios para Chart.js
Chart.register(
  ...registerables,
  CandlestickController,
  OhlcController,
  CandlestickElement,
  OhlcElement,
  TimeScale,
  LinearScale,
  CategoryScale
);

const CandleData = () => {
  const [data1003, setData1003] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Para almacenar la instancia del gráfico

  // Variable para controlar el ancho de las velas desde el código
  const candleWidth = 0.3; // Ajusta este valor para cambiar el ancho de las velas (valores entre 0 y 1)

  // Acceder al contexto de WebSocket
  const { message, error } = useWebSocket(); // Elimina `isConnected` y `connectWebSocket`

  // Procesar los mensajes recibidos desde el WebSocket
  useEffect(() => {
    if (message) {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
        console.log('Mensaje JSON.parseado completo:', parsedMessage);
      } catch (e) {
        console.error('Error parsing JSON:', e.message);
        return;
      }

      if (parsedMessage?.id !== 1003 || parsedMessage?.market !== 71) {
        console.log('El mensaje recibido no es para el ID 1003 o el mercado 71.');
        return;
      }

      const result = parsedMessage?.data?.data?.data;
      if (!result || !result.datasets || !Array.isArray(result.datasets)) {
        console.error('No se encontraron datasets válidos.');
        return;
      }

      if (!result.labels || !Array.isArray(result.labels)) {
        console.error('No se encontraron etiquetas válidas.');
        return;
      }

      // Convertir las etiquetas (labels) de cadenas a objetos Date
      const labels = result.labels.map(label => new Date(label));

      const candles = result.datasets[0]?.data || [];

      if (candles.length === 0 || labels.length === 0) {
        console.error('No se encontraron datos o etiquetas válidas.');
        return;
      }

      const newCandles = candles.map((candle, index) => ({
        x: labels[index], // El eje X será el tiempo convertido a formato de fecha
        o: candle.o, // Apertura
        h: candle.h, // Máximo
        l: candle.l, // Mínimo
        c: candle.c, // Cierre
      }));

      // Actualizar los datos sin destruir el gráfico
      setData1003((prevData) => [...prevData, ...newCandles]);

      if (chartInstance.current) {
        chartInstance.current.data.datasets[0].data = [...data1003, ...newCandles]; // Usar data1003 en lugar de prevData
        chartInstance.current.update(); // Actualizar el gráfico sin destruirlo
      }
    }
  }, [message, data1003]);

  // Crear o actualizar el gráfico de velas
  useEffect(() => {
    if (chartRef.current && data1003.length > 0 && !chartInstance.current) {
      const ctx = chartRef.current.getContext('2d');

      // Crear el gráfico solo si aún no existe
      chartInstance.current = new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [{
            label: 'Cotización USD/COP',
            data: data1003,
            borderColor: ({ o, c }) => (c > o ? 'blue' : 'red'), // Azul si el cierre es mayor, rojo si es menor
            color: ({ o, c }) => (c > o ? 'blue' : 'red'), // Misma lógica para el color del cuerpo
            barPercentage: candleWidth, // Controlar el ancho de las velas
            categoryPercentage: candleWidth, // Ajustar el espacio entre velas
          }]
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'minute', // Establecer la unidad en minutos
                tooltipFormat: 'yyyy-MM-dd HH:mm', // Formato para el tooltip
                displayFormats: {
                  minute: 'yyyy-MM-dd HH:mm', // Mostrar fecha y hora en el eje X
                }
              },
              title: {
                display: true,
                text: 'Fecha/Hora',
              },
              ticks: {
                autoSkip: true, // Saltar etiquetas para evitar superposición
                maxRotation: 0, // Evitar rotación de etiquetas
                minRotation: 0,
                source: 'auto', // Asegurar que las etiquetas se generen automáticamente
              },
              grid: {
                display: true, // Mostrar las líneas de la cuadrícula en el eje X
              },
            },
            y: {
              beginAtZero: false, // No empezar en 0, ajustarse a los precios
              title: {
                display: true,
                text: 'Precio USD/COP',
              },
              grid: {
                display: true, // Mostrar líneas de cuadrícula en el eje Y
              },
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const ohlc = context.raw;
                  return [
                    `Open: ${ohlc.o}`,
                    `High: ${ohlc.h}`,
                    `Low: ${ohlc.l}`,
                    `Close: ${ohlc.c}`
                  ];
                }
              }
            }
          },
          responsive: true, // Ajuste automático de tamaño
          maintainAspectRatio: true // Mantener la relación de aspecto
        }
      });
    }
  }, [data1003]);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div style={{ width: '100%', height: '400px' }}>
        {data1003.length > 0 ? (
          <canvas ref={chartRef} />
        ) : (
          <p>No se han recibido datos para generar el gráfico.</p>
        )}
      </div>
    </div>
  );
};

export default CandleData;
