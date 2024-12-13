import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useWebSocketDelay } from '../../Pages/Context/WebSocketContextDelay';
import './Styles/responsivedolar.css';

const Delaysocket = () => {
  const chartComponentRef = useRef(null);
  const chartContainerRef = useRef(null);
  const { message } = useWebSocketDelay();
  const data1000Ref = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartOptions, setChartOptions] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (chartComponentRef.current) {
        chartComponentRef.current.chart.reflow();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      const datosGraficoString = result?.datos_grafico_moneda_mercado;

      if (!datosGraficoString) {
        console.error('No se pudo acceder a datos_grafico_moneda_mercado:', result);
        return;
      }

      const preciosCierreMatch = datosGraficoString.match(/Precios de cierre',data:\s*\[([0-9.,\s]+)\]/);
      const labelsMatch = datosGraficoString.match(/labels:\s*\[([0-9:,\s.]+)\]/);
      const montosMatch = datosGraficoString.match(/Montos \(Miles USD\)',data:\s*\[([0-9.,\s]+)\]/);

      const preciosCierre = preciosCierreMatch ? preciosCierreMatch[1].split(',').map(Number) : [];
      const labels = labelsMatch ? labelsMatch[1].split(',') : [];
      const montos = montosMatch ? montosMatch[1].split(',').map(Number) : [];

      if (preciosCierre.length !== labels.length || preciosCierre.length !== montos.length) {
        console.error('Los datos, etiquetas y montos no coinciden en longitud.');
        return;
      }

      data1000Ref.current = {
        preciosCierre,
        labels,
        montos,
      };

      renderChart(preciosCierre, labels, montos);
      setIsLoading(false);
    }
  }, [message]);

  const renderChart = (preciosCierre, labels, montos) => {
    const precioInicial = preciosCierre.length > 0 ? preciosCierre[0] : 0;
    const dynamicMin = Math.min(...preciosCierre) - 20;
    const dynamicMax = Math.max(...preciosCierre) + 20;

    const options = {
      chart: {
        type: 'area',
        height: 700,
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
        backgroundColor: isFullscreen ? 'white' : null,
        events: {
          click: function () {
            this.container.focus();
          },
        },
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: labels,
        title: {
          text: 'Tiempo',
          style: {
            fontWeight: '500',
          },
        },
        labels: {
          rotation: 0,
          step: Math.ceil(labels.length / 10),
          style: {
            fontWeight: '500',
          },
        },
      },
      yAxis: [
        {
          title: {
            text: 'Precios',
            style: {
              fontWeight: '500',
            },
          },
          gridLineWidth: 0,
          tickInterval: 10,
          min: dynamicMin,
          max: dynamicMax,
          plotLines: [
            {
              value: precioInicial,
              color: 'black',
              width: 2,
              dashStyle: 'Dash',
              label: {
                text: `Precio Inicial: ${precioInicial}`,
                align: 'right',
                style: {
                  color: 'black',
                },
              },
            },
          ],
        },
        {
          title: {
            text: 'Montos (Miles USD)',
            style: {
              fontWeight: '500',
            },
          },
          opposite: true,
          gridLineWidth: 0,
          tickInterval: 1000,
          min: 0,
          max: Math.ceil(Math.max(...montos) / 1000) * 1000,
          labels: {
            formatter: function () {
              return this.value;
            },
            style: {
              fontWeight: '500',
            },
          },
        },
      ],
      series: [
        {
          name: 'Precios',
          data: preciosCierre,
          lineWidth: 2,
          color: 'rgba(255, 0, 0, 0.9)',
          zones: [
            {
              value: precioInicial,
              color: 'rgba(255, 0, 0, 0.9)',
              fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, 'rgba(255, 0, 0, 0.3)'],
                  [1, 'rgba(255, 0, 0, 0)'],
                ],
              },
            },
            {
              color: 'rgba(34, 186, 42, 0.8)',
              fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, 'rgba(34, 186, 42, 0.3)'],
                  [1, 'rgba(34, 186, 42, 0)'],
                ],
              },
            },
          ],
          marker: {
            enabled: false,
          },
          yAxis: 0,
        },
        {
          name: 'Montos',
          data: montos,
          type: 'column',
          color: 'rgba(128, 128, 128, 0.4)',
          yAxis: 1,
        },
      ],
    };

    setChartOptions(options);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      chartContainerRef.current.requestFullscreen().catch((err) => {
        console.error('Error al entrar en pantalla completa:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Error al salir de pantalla completa:', err);
      });
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    let zoomTimeout;

    const handleWheelZoom = (event) => {
      event.preventDefault();

      if (!chartComponentRef.current) return;

      const chart = chartComponentRef.current.chart;
      const extremes = chart.xAxis[0].getExtremes();

      const zoomFactor = 0.2;
      const delta = event.deltaY < 0 ? 1 : -1;

      const newMin = Math.max(extremes.dataMin, extremes.min + delta * zoomFactor * (extremes.max - extremes.min));
      const newMax = Math.min(extremes.dataMax, extremes.max - delta * zoomFactor * (extremes.max - extremes.min));

      clearTimeout(zoomTimeout);
      zoomTimeout = setTimeout(() => {
        chart.xAxis[0].setExtremes(newMin, newMax);
      }, 50); // Reduce el lag
    };

    const chartContainer = chartContainerRef.current;
    chartContainer.addEventListener('wheel', handleWheelZoom);

    return () => {
      chartContainer.removeEventListener('wheel', handleWheelZoom);
    };
  }, []);

  return (
    <div
      className="delaysocket-container"
      ref={chartContainerRef}
      style={{ backgroundColor: isFullscreen ? 'white' : 'transparent', position: 'relative' }}
    >
      {isLoading ? (
        <p className="loading-text">Esperando datos...</p>
      ) : (
        chartOptions && (
          <>
            <button
              className="fullscreen-button"
              onClick={toggleFullscreen}
              style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}
            >
              <span role="img" aria-label="Pantalla completa">🔍</span>
            </button>
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              ref={chartComponentRef}
              containerProps={{
                style: {
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                },
              }}
            />
          </>
        )
      )}
    </div>
  );
};

export default Delaysocket;
