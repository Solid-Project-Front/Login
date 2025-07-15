import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getUser, logout } from "~/lib";
import { Show, Suspense } from "solid-js";

export const route = {
  preload() { getUser({}, {}) }
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUser({}, {}));
  
  return (
    <main>
      <Suspense fallback={<div>Cargando...</div>}>
        <Show when={user()} fallback={<div>Redirigiendo al login...</div>}>
          <div class="welcome-container">
            <img src="logo.png" alt="Red Coop Central Logo" class="logo" />
            <div class="user-info">
              <h2>¡Bienvenido {user()?.username}!</h2>
              <p>Has iniciado sesión correctamente en el sistema</p>
            </div>
            <form action={logout} method="post" class="logout-form">
              <button type="submit" class="logout-button">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </Show>
      </Suspense>
    </main>
  );
}
