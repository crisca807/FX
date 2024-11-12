import React from 'react';
import './Styles/SubscriptionPlans.css'; // Asegúrate de que la ruta sea correcta

const SubscriptionPlans = () => {
  return (
    <div className="subscription-page">
      <h1 className="subscription-title">Planes de Suscripción - SET ICAP</h1>
      <p className="subscription-description">
        Elige el plan que mejor se adapte a tus necesidades y obtén acceso a información en tiempo real sobre el mercado de divisas USD/COP.
      </p>
      <div className="subscription-plans">
        {/* Plan Semestral (Plan Grande con Badge Popular) */}
        <div className="subscription-card large-plan">
          <span className="popular-badge">Popular</span>
          <h2>Plan Semestral</h2>
          <h3>Suscripción Dólar SET-FX</h3>
          <p className="price">$ 1.042.859</p>
          <p className="duration">Semestral</p>
          <ul>
            <li>Información en tiempo real</li>
            <li>1 Usuario</li>
            <li>Soporte gratuito</li>
          </ul>
        </div>
        
        {/* Plan Trimestral */}
        <div className="subscription-card small-plan">
          <h2>Plan Trimestral</h2>
          <h3>Suscripción Dólar SET-FX</h3>
          <p className="price">$ 562.275</p>
          <p className="duration">Trimestral</p>
          <ul>
            <li>Información en tiempo real</li>
            <li>1 Usuario</li>
            <li>Soporte gratuito</li>
          </ul>
        </div>
        
        {/* Plan Anual */}
        <div className="subscription-card small-plan">
          <h2>Plan Anual</h2>
          <h3>Suscripción Dólar SET-FX</h3>
          <p className="price">$ 1.914.214</p>
          <p className="duration">Anual</p>
          <ul>
            <li>Información en tiempo real</li>
            <li>1 Usuario</li>
            <li>Soporte gratuito</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
