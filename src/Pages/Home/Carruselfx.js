import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; // Asegúrate de que los módulos sean correctos
import 'swiper/css'; // Estilos básicos de Swiper
import 'swiper/css/navigation'; // Estilos de navegación
import 'swiper/css/pagination'; // Estilos de paginación
import '../Home/Styles/customswipper.css'; // Asegúrate de que la ruta esté correcta

// Importa las imágenes
import firstImage from '../../Assets/Images/volatility.png'; // Asegúrate de que la ruta sea correcta
import secondImage from '../../Assets/Images/apreton-de-manos.png'; // Ajusta la ruta según tu estructura
import thirdImage from '../../Assets/Images/image (27).png'; // Ajusta la ruta según tu estructura

const Carruselfx = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination]} // Añadir los módulos
      spaceBetween={50}
      slidesPerView={1}
      navigation // Habilitar navegación
      pagination={{ clickable: true }} // Habilitar paginación con clic
      autoplay={{ delay: 3000 }} // Configurar autoplay si lo necesitas
      loop={true} // Habilitar loop para repetir los slides
    >
      {/* Primer slide con la primera imagen */}
      <SwiperSlide>
        <div className="content-wrapper">
          <div className="text-content">
            <h2>Tu aliado estratégico en la 
            <h2> intermediación financiera</h2></h2>
            <p>Contenido del primer slide.</p>
            {/* Botón Iniciar Sesión */}
            <button className="custom-button">Iniciar sesión</button>
          </div>
          <div className="image-content">
            <img
              src={firstImage} // Imagen del primer slide
              alt="Primera imagen"
              style={{ maxWidth: '480px', height: 'auto' }} // Ajusta el tamaño de la imagen según lo necesites
            />
          </div>
        </div>
      </SwiperSlide>

      {/* Segundo slide con la segunda imagen */}
      <SwiperSlide>
        <div className="content-wrapper">
          <div className="text-content">
            <h2>Optimiza tus operaciones financieras con soluciones ágiles y confiables.</h2>
            <p>Contenido del segundo slide.</p>
            {/* Botón Iniciar Sesión */}
            <button className="custom-button">Iniciar sesión</button>
          </div>
          <div className="image-content">
            <img
              src={secondImage} // Imagen del segundo slide
              alt="Segunda imagen"
              style={{ maxWidth: '480px', height: 'auto' }} // Ajusta el tamaño de la imagen según lo necesites
            />
          </div>
        </div>
      </SwiperSlide>

      {/* Tercer slide con la tercera imagen */}
      <SwiperSlide>
        <div className="content-wrapper">
          <div className="text-content">
            <h2>Soluciones eficientes con respaldo tecnológico en los mercados financieros.</h2>
            <p>Contenido del tercer slide.</p>
            {/* Botón Iniciar Sesión */}
            <button className="custom-button">Iniciar sesión</button>
          </div>
          <div className="image-content">
            <img
              src={thirdImage} // Imagen del tercer slide
              alt="Tercera imagen"
              style={{ maxWidth: '480px', height: 'auto' }} // Ajusta el tamaño de la imagen según lo necesites
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Carruselfx;
