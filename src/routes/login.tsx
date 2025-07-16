import {
  useSubmission,
  useSearchParams,
  type RouteSectionProps,
} from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import { loginOrRegister } from "~/lib";
import { useFormValidation } from "~/lib/hooks/useFormValidation";
import { ValidatedInput } from "~/components/ValidatedInput";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);
  const [searchParams] = useSearchParams();
  const [loginType, setLoginType] = createSignal("login");

  const isRegister = () => loginType() === "register";
  const formValidation = useFormValidation(isRegister);

  const successMessage = () => {
    if (searchParams.message === "password-reset-success") {
      return "Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión.";
    }
    return null;
  };

  const handleLoginTypeChange = (type: string) => {
    setLoginType(type);
  };

  return (
    <main>
      <h1>Bienvenido</h1>

      <Show when={successMessage()}>
        <div class="success-banner">
          <div class="success-icon">✓</div>
          <p>{successMessage()}</p>
        </div>
      </Show>

      <form action={loginOrRegister} method="post">
        <input
          type="hidden"
          name="redirectTo"
          value={props.params.redirectTo ?? "/"}
        />
        <input type="hidden" name="loginType" value={loginType()} />

        <fieldset disabled={loggingIn.pending}>
          <legend>¿Iniciar sesión o registrarse?</legend>
          <label>
            <input
              type="radio"
              name="loginTypeRadio"
              value="login"
              checked={loginType() === "login"}
              onChange={() => handleLoginTypeChange("login")}
            />{" "}
            Iniciar sesión
          </label>
          <label>
            <input
              type="radio"
              name="loginTypeRadio"
              value="register"
              checked={loginType() === "register"}
              onChange={() => handleLoginTypeChange("register")}
            />{" "}
            Registrarse
          </label>
        </fieldset>

        <ValidatedInput
          id="username"
          name="username"
          type="text"
          placeholder={isRegister() ? "Ingresa tu usuario" : "Usuario o email"}
          value={formValidation.formData().username}
          error={formValidation.errors().username}
          showError={formValidation.shouldShowError("username")}
          required={true}
          disabled={loggingIn.pending}
          onInput={(value) => formValidation.updateField("username", value)}
          onBlur={() => formValidation.markFieldAsTouched("username")}
        />

        <Show when={isRegister()}>
          <ValidatedInput
            id="email"
            name="email"
            type="email"
            placeholder="Ingresa tu email"
            value={formValidation.formData().email}
            error={formValidation.errors().email}
            showError={formValidation.shouldShowError("email")}
            required={true}
            disabled={loggingIn.pending}
            onInput={(value) => formValidation.updateField("email", value)}
            onBlur={() => formValidation.markFieldAsTouched("email")}
          />
        </Show>

        <ValidatedInput
          id="password"
          name="password"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={formValidation.formData().password}
          error={formValidation.errors().password}
          showError={formValidation.shouldShowError("password")}
          required={true}
          disabled={loggingIn.pending}
          onInput={(value) => formValidation.updateField("password", value)}
          onBlur={() => formValidation.markFieldAsTouched("password")}
        />

        <Show when={isRegister()}>
          <ValidatedInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirma tu contraseña"
            value={formValidation.formData().confirmPassword}
            error={formValidation.errors().confirmPassword}
            showError={formValidation.shouldShowError("confirmPassword")}
            required={true}
            disabled={loggingIn.pending}
            onInput={(value) => formValidation.updateField("confirmPassword", value)}
            onBlur={() => formValidation.markFieldAsTouched("confirmPassword")}
          />
        </Show>

        <button type="submit" class="login-button" disabled={loggingIn.pending}>
          {loggingIn.pending
            ? "Procesando..."
            : loginType() === "login"
            ? "Iniciar sesión"
            : "Registrarse"}
        </button>

        <Show when={loginType() === "login"}>
          <div class="forgot-password-link">
            <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
          </div>
        </Show>

        <Show when={loggingIn.result}>
          <p
            role="alert"
            id="error-message"
            class={loggingIn.result instanceof Error ? "error" : ""}
          >
            {loggingIn.result instanceof Error ? loggingIn.result.message : ""}
          </p>
        </Show>
      </form>
    </main>
  );
}
