import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/news.css'; // Importamos el archivo de estilos

// URL de las noticias en formato RSS/XML
const API_URL = 'http://set-fx.com/api/v1/dolar/public/news';

const NewsComponent = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener las noticias
    const fetchNews = async () => {
      try {
        // Petición GET a la API de noticias
        const response = await axios.get(API_URL, { headers: { 'Content-Type': 'application/rss+xml' } });
        const xmlText = response.data;

        // Convertir el XML a un documento DOM
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

        // Obtener todos los elementos <item> del feed RSS
        const items = xmlDoc.getElementsByTagName('item');
        const newsArray = [];

        // Iterar sobre los elementos <item> y extraer los datos relevantes
        for (let i = 0; i < items.length && i < 4; i++) { // Solo obtenemos las 4 noticias más recientes
          const item = items[i];
          const title = item.getElementsByTagName('title')[0]?.textContent;
          const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent;
          const link = item.getElementsByTagName('link')[0]?.textContent.trim();
          const description = item.getElementsByTagName('description')[0]?.textContent;

          // Agregar las noticias al array
          newsArray.push({
            title,
            pubDate,
            link,
            description,
          });
        }

        // Actualizar el estado con las noticias
        setNews(newsArray);
      } catch (err) {
        console.error('Error al obtener las noticias:', err);
        setError('Error al obtener las noticias');
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-container">
      <div className="news-header">
        <h1>Noticias más destacadas sobre el mercado</h1>
        <div className="news-logo"></div> {/* Cambié la etiqueta img por un div */}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="news-grid">
        {news.map((item, index) => (
          <div key={index} className="news-item">
            <h2>{item.title}</h2>
           
            <p>{item.description}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              Leer más
            </a>
            <p><strong>Publicado el:</strong> {new Date(item.pubDate).toLocaleString()}</p>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsComponent;
