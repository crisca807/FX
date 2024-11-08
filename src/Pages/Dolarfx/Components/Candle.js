import React, { useEffect, useState, useRef } from 'react';
import { useWebSocket } from '../../Context/Websocketcontext';
import { Chart, registerables, CategoryScale, LinearScale } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';

// Registrar los controladores necesarios para Chart.js
Chart.register(...registerables, CandlestickController, CandlestickElement, CategoryScale, LinearScale);

const CandleData = () => {
  const [data1003, setData1003] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const candleWidth = 0.5;

  const { message, error } = useWebSocket();

  useEffect(() => {
    if (message) {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (e) {
        console.error('Error parsing JSON:', e.message);
        return;
      }

      if (parsedMessage?.id === 1003 && parsedMessage?.market === 71) {
        const result = parsedMessage?.data?.data?.data;
        if (!result || !result.datasets || !Array.isArray(result.datasets) || !result.labels) {
          return;
        }

        const labels = result.labels;
        const candles = result.datasets[0]?.data || [];

        const newCandles = candles.map((candle, index) => ({
          x: labels[index],
          o: candle.o,
          h: candle.h,
          l: candle.l,
          c: candle.c,
        }));

        setData1003(newCandles);
      }
    }
  }, [message]);

  useEffect(() => {
    if (chartRef.current && data1003.length > 0) {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [{
            label: 'Cotización USD/COP',
            data: data1003,
            borderColor: ({ o, c }) => (c > o ? 'blue' : 'red'),
            color: ({ o, c }) => (c > o ? 'blue' : 'red'),
            barPercentage: candleWidth,
            categoryPercentage: candleWidth,
          }]
        },
        options: {
          scales: {
            x: {
              type: 'category',
              labels: data1003.map(item => item.x),
              title: {
                display: true,
                text: 'Hora',
                font: {
                  size: 14,
                  weight: 'bold',
                },
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 6,
                autoSkipPadding: 15,
                maxRotation: 0,
                minRotation: 0,
              },
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Precio USD/COP',
              },
              suggestedMin: 4400,
              suggestedMax: 4450,
              ticks: {
                stepSize: 10,
                callback: function (value) {
                  return value.toFixed(2);
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                display: true,
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
          responsive: true,
          maintainAspectRatio: false,
        }
      });
    }
  }, [data1003]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div style={{ width: '1360px', height: '500px' }}> {/* Ancho de aproximadamente 34.5 cm */}
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
