export default function Home() {

  return (
    <main class="public-home">
      <div class="hero-section">
        <div class="hero-content">
          <img src="logo.png" alt="Red Coop Central Logo" class="hero-logo" />
          <h1 class="hero-title">Red Coop Central</h1>
          <p class="hero-subtitle">
            Conectando cooperativas, fortaleciendo comunidades
          </p>
          <p class="hero-description">
            Plataforma innovadora diseñada para fortalecer y conectar cooperativas 
            en toda la región. Facilitamos la colaboración, el intercambio de recursos 
            y el crecimiento mutuo de nuestras comunidades cooperativas.
          </p>
          <div class="hero-actions">
            <a href="/about" class="cta-button primary">
              Conocer Más
            </a>
          </div>
        </div>
      </div>
      
      <div class="features-preview">
        <div class="container">
          <h2>¿Por qué elegir Red Coop Central?</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🤝</div>
              <h3>Cooperación</h3>
              <p>Conecta con otras cooperativas y fortalece la red de colaboración</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔒</div>
              <h3>Seguridad</h3>
              <p>Sistema seguro con autenticación robusta y protección de datos</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <h3>Gestión</h3>
              <p>Herramientas integradas para la gestión eficiente de tu cooperativa</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🌱</div>
              <h3>Crecimiento</h3>
              <p>Impulsa el desarrollo sostenible de tu organización</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
