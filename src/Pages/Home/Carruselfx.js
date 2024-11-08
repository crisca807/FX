import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../Home/Styles/customswipper.css';

// Importa las imágenes
import firstImage from '../../Assets/Images/volatility.png';
import secondImage from '../../Assets/Images/apreton-de-manos.png';
import thirdImage from '../../Assets/Images/image (27).png';

const Carruselfx = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation // Habilita navegación con flechas
      pagination={{ clickable: true }} // Habilita paginación con clic
      autoplay={{ delay: 8000, disableOnInteraction: false }} // Autoplay con 8 segundos de retraso
      loop={true} // Habilita loop para repetir los slides
      speed={600} // Velocidad de la transición para hacerla más suave
      effect="slide" // Efecto de deslizamiento suave
    >
      <SwiperSlide>
        <div className="content-wrapper">
          <div className="text-content">
            <h2>Tu aliado estratégico en la 
              <h2> intermediación financiera</h2>
            </h2>
            <button className="custom-button">Iniciar sesión</button>
          </div>
          <div className="image-content">
            <img
              src={firstImage}
              alt="Primera imagen"
              style={{ maxWidth: '480px', height: 'auto' }}
            />
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="content-wrapper">
          <div className="text-content">
            <h2>Optimiza tus operaciones financieras con soluciones ágiles y confiables.</h2>
            <button className="custom-button">Iniciar sesión</button>
          </div>
          <div className="image-content">
            <img
              src={secondImage}
              alt="Segunda imagen"
              style={{ maxWidth: '480px', height: 'auto' }}
            />
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="content-wrapper">
          <div className="text-content">
            <h2>Soluciones eficientes con respaldo tecnológico en los mercados financieros.</h2>
            <button className="custom-button">Iniciar sesión</button>
          </div>
          <div className="image-content">
            <img
              src={thirdImage}
              alt="Tercera imagen"
              style={{ maxWidth: '480px', height: 'auto' }}
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Carruselfx;
