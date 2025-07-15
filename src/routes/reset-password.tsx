import { useSubmission, useSearchParams } from "@solidjs/router";
import { Show, createSignal, onMount } from "solid-js";
import { resetPasswordAction } from "~/lib";

export default function ResetPassword() {
  const submitting = useSubmission(resetPasswordAction);
  const [searchParams] = useSearchParams();
  const [token, setToken] = createSignal("");

  onMount(() => {
    const urlToken = searchParams.token;
    if (urlToken && typeof urlToken === 'string') {
      setToken(urlToken);
    }
  });

  return (
    <main>
      <div class="reset-password-container">
        <div class="reset-password-header">
          <img src="logo.png" alt="Red Coop Central Logo" class="logo" />
          <h1>Restablecer Contraseña</h1>
          <p class="subtitle">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <Show when={!token()}>
          <div class="error-container">
            <div class="error-icon">⚠</div>
            <h2>Token inválido</h2>
            <p>El enlace de recuperación no es válido o ha expirado.</p>
            <div class="back-to-login">
              <a href="/forgot-password" class="back-link">Solicitar nuevo enlace</a>
            </div>
          </div>
        </Show>

        <Show when={token()}>
          <form action={resetPasswordAction} method="post" class="reset-password-form">
            <input type="hidden" name="token" value={token()} />
            
            <div>
              <label for="password">Nueva contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Nueva contraseña"
                required={true}
                disabled={submitting.pending}
              />
            </div>

            <div>
              <label for="confirmPassword">Confirmar nueva contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirmar nueva contraseña"
                required={true}
                disabled={submitting.pending}
              />
            </div>

            <button 
              type="submit" 
              class="submit-button" 
              disabled={submitting.pending}
            >
              {submitting.pending ? "Actualizando..." : "Actualizar contraseña"}
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