import React, { useState } from 'react';
import './Styles/SubscriptionPlans.css';

const SubscriptionPlans = () => {
  const [activePlan, setActivePlan] = useState('Plan Semestral'); // Dejar 'Plan Semestral' abierto por defecto

  const plans = [
    {
      name: 'Plan trimestral',
      description:
        'Accede a servicios exclusivos de Set-icap con nuestra suscripción trimestral. Conéctate a lo mejor del mercado financiero en solo 3 meses.',
      deposit: '$562.275',
    },
    {
      name: 'Plan Semestral',
      description:
        'Optimiza tus inversiones con nuestro plan semestral. Asegura acceso continuo a datos y análisis de alta calidad para tomar decisiones informadas.',
      deposit: '$1.042.859',
    },
    {
      name: 'Plan Anual',
      description:
        'Transforma tu estrategia financiera con el plan anual de Set-icap. Obtén todo el apoyo necesario durante todo el año para maximizar tus oportunidades.',
      deposit: '$1.914.214',
    },
  ];

  const isMobile = window.innerWidth <= 768; // Detecta si es móvil

  return (
    <div className="subscription-page">
      {/* Sección de promoción */}
      <div className="promo-section">
        <h1>análisis financiero avanzado, suscripciones para decisiones inteligentes y de alto rendimiento.</h1>
        <p>
         
        </p>
        <button className="cta-button">Descubre más</button>
      </div>

      {isMobile ? (
        // Diseño para móviles: Botones en lugar de cuadros
        <div className="mobile-selection">
          <div className="mobile-buttons">
            {plans.map((plan) => (
              <button
                key={plan.name}
                className={`mobile-plan-button ${
                  activePlan === plan.name ? 'active' : ''
                }`}
                onClick={() => setActivePlan(plan.name)}
              >
                {plan.name}
              </button>
            ))}
          </div>
          <div className="mobile-plan-details">
            <h2>{activePlan}</h2>
            <p className="description">
              {plans.find((plan) => plan.name === activePlan)?.description}
            </p>
            <p className="deposit">
              {' '}
              {plans.find((plan) => plan.name === activePlan)?.deposit}
            </p>
            <button className="cta-button">Abrir cuenta</button>
          </div>
        </div>
      ) : (
        // Diseño para pantallas grandes
        <div className="subscription-container">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`subscription-card ${
                activePlan === plan.name ? 'active' : ''
              }`}
              onMouseEnter={() => setActivePlan(plan.name)}
              onMouseLeave={() => setActivePlan('Plan Semestral')} // Se cierra al pasar el mouse
            >
              <div className="card-header">
                <h2>{plan.name}</h2>
              </div>
              <div
                className={`card-content ${
                  activePlan === plan.name ? 'show' : ''
                }`}
              >
                <p className="description">{plan.description}</p>
                <p className="deposit">Depósito de {plan.deposit}</p>
                <button className="cta-button">Abrir cuenta</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
