import { useSubmission, useSearchParams } from "@solidjs/router";
import { Show, createSignal, onMount } from "solid-js";
import { resetPasswordAction } from "~/lib";
import { validatePassword, validateConfirmPassword } from "~/lib/utils/validation";

export default function ResetPassword() {
  const submitting = useSubmission(resetPasswordAction);
  const [searchParams] = useSearchParams();
  const [token, setToken] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [errors, setErrors] = createSignal({ password: "", confirmPassword: "" });

  onMount(() => {
    const urlToken = searchParams.token;
    if (urlToken && typeof urlToken === 'string') {
      setToken(urlToken);
    }
  });

  const handlePasswordInput = (value: string) => {
    setPassword(value);
    const validation = validatePassword(value);
    setErrors(prev => ({ ...prev, password: validation.isValid ? "" : validation.message || "" }));
  };

  const handleConfirmPasswordInput = (value: string) => {
    setConfirmPassword(value);
    const validation = validateConfirmPassword(password(), value);
    setErrors(prev => ({ ...prev, confirmPassword: validation.isValid ? "" : validation.message || "" }));
  };

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
                value={password()}
                required={true}
                disabled={submitting.pending}
                onInput={(e) => handlePasswordInput(e.currentTarget.value)}
                class={errors().password ? "validated-input has-error" : "validated-input"}
              />
              <Show when={errors().password}>
                <div class="error-message" role="alert">
                  {errors().password}
                </div>
              </Show>
            </div>

            <div>
              <label for="confirmPassword">Confirmar nueva contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword()}
                required={true}
                disabled={submitting.pending}
                onInput={(e) => handleConfirmPasswordInput(e.currentTarget.value)}
                class={errors().confirmPassword ? "validated-input has-error" : "validated-input"}
              />
              <Show when={errors().confirmPassword}>
                <div class="error-message" role="alert">
                  {errors().confirmPassword}
                </div>
              </Show>
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