export default function NotFound() {
  return (
    <main>
      <div class="error-container">
        <div class="error-icon">404</div>
        <h2>Página No Encontrada</h2>
        <p>La página que buscas no existe o ha sido movida.</p>
        <div class="back-to-login">
          <a href="/" class="back-link">← Volver al inicio</a>
        </div>
      </div>
    </main>
  );
}
