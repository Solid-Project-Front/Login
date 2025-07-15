import {
  useSubmission,
  type RouteSectionProps
} from "@solidjs/router";
import { Show } from "solid-js";
import { loginOrRegister } from "~/lib";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);

  return (
    <main>
      <h1>Bienvenido</h1>
      <form action={loginOrRegister} method="post">
        <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />
        <fieldset disabled={loggingIn.pending}>
          <legend>¿Iniciar sesión o registrarse?</legend>
          <label>
            <input type="radio" name="loginType" value="login" checked={true} /> Iniciar sesión
          </label>
          <label>
            <input type="radio" name="loginType" value="register" /> Registrarse
          </label>
        </fieldset>
        <div>
          <label for="username">Usuario</label>
          <input 
            id="username"
            name="username" 
            type="text"
            placeholder="Ingresa tu usuario" 
            required
            disabled={loggingIn.pending}
          />
        </div>
        <div>
          <label for="password">Contraseña</label>
          <input 
            id="password"
            name="password" 
            type="password" 
            placeholder="Ingresa tu contraseña"
            required
            disabled={loggingIn.pending}
          />
        </div>
        <button type="submit" class="login-button" disabled={loggingIn.pending}>
          {loggingIn.pending ? "Procesando..." : "Iniciar sesión"}
        </button>
        <Show when={loggingIn.result}>
          <p role="alert" id="error-message" class={loggingIn.result instanceof Error ? "error" : ""}>
            {loggingIn.result instanceof Error ? loggingIn.result.message : ""}
          </p>
        </Show>
      </form>
    </main>
  );
}
