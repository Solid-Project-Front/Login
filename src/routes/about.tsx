import type { Component } from "solid-js";

const About: Component = () => {
  return (
    <main>
      <div class="about-container">
        <div class="about-header">
          <img 
            src="logo.png" 
            alt="Red Coop Central Logo" 
            class="about-logo"
          />
          <h1>Red Coop Central</h1>
          <p class="subtitle">Conectando cooperativas, fortaleciendo comunidades</p>
        </div>

        <div class="about-section">
          <h2>¿Quiénes Somos?</h2>
          <p>
            Red Coop Central es una plataforma innovadora diseñada para fortalecer 
            y conectar cooperativas en toda la región. Facilitamos la colaboración, 
            el intercambio de recursos y el crecimiento mutuo de nuestras comunidades cooperativas.
          </p>
        </div>

        <div class="about-grid">
          <div class="feature-card">
            <h3>Nuestra Misión</h3>
            <p>
              Empoderar a las cooperativas mediante herramientas digitales y conexiones 
              significativas que impulsen su desarrollo y sostenibilidad.
            </p>
          </div>

          <div class="feature-card">
            <h3>Nuestra Visión</h3>
            <p>
              Ser la red líder en la integración y fortalecimiento del movimiento 
              cooperativo, promoviendo la economía social y solidaria.
            </p>
          </div>

          <div class="feature-card">
            <h3>Valores</h3>
            <ul>
              <li>Cooperación</li>
              <li>Transparencia</li>
              <li>Innovación</li>
              <li>Solidaridad</li>
            </ul>
          </div>

          <div class="feature-card">
            <h3>Beneficios</h3>
            <ul>
              <li>Gestión integrada</li>
              <li>Conexión entre cooperativas</li>
              <li>Herramientas colaborativas</li>
              <li>Soporte especializado</li>
            </ul>
          </div>
        </div>

        <div class="contact-section">
          <h2>Contáctanos</h2>
          <p>
            ¿Interesado en formar parte de nuestra red? Estamos aquí para ayudarte 
            a fortalecer tu cooperativa y conectarte con otras organizaciones afines.
          </p>
          <button class="contact-button">
            Únete a la Red
          </button>
        </div>
      </div>
    </main>
  );
};

export default About; 