import axios from 'axios';

const API_URL = 'http://set-fx.com/api/v1/dolar/public/news';

// Servicio para obtener las noticias desde la API
const getNews = async () => {
  try {
    const response = await axios.get(API_URL);
    // Retorna las noticias obtenidas
    return response.data;
  } catch (error) {
    console.error('Error al obtener las noticias:', error);
    throw error; // Propaga el error para manejarlo en el componente que lo consuma
  }
};

export default getNews;
