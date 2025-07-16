import { useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import { forgotPassword } from "~/lib";

export default function ForgotPassword() {
  const submitting = useSubmission(forgotPassword);

  return (
    <main>
      <div class="forgot-password-container">
        <div class="forgot-password-header">
          <img src="logo.png" alt="Red Coop Central Logo" class="logo" />
          <h1>Recuperar Contraseña</h1>
          <p class="subtitle">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        <Show 
          when={!submitting.result || submitting.result instanceof Error}
          fallback={
            <div class="success-message">
              <div class="success-icon">✓</div>
              <h2>¡Solicitud enviada!</h2>
              <p>{submitting.result && typeof submitting.result === 'object' && 'message' in submitting.result ? submitting.result.message : ''}</p>
              
              <div class="back-to-login">
                <a href="/login" class="back-link">Volver al inicio de sesión</a>
              </div>
            </div>
          }
        >
          <form action={forgotPassword} method="post" class="forgot-password-form">
            <div>
              <label for="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Correo electrónico"
                required={true}
                disabled={submitting.pending}
              />
            </div>

            <button 
              type="submit" 
              class="submit-button" 
              disabled={submitting.pending}
            >
              {submitting.pending ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>

            <div class="back-to-login">
              <a href="/login" class="back-link">← Volver al inicio de sesión</a>
            </div>

            <Show when={submitting.result instanceof Error}>
              <p role="alert" class="error-message">
                {submitting.result?.message}
              </p>
            </Show>
          </form>
        </Show>
      </div>
    </main>
  );
}