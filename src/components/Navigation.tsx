import { createAsync } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { getUser, logout } from "~/lib";

export function Navigation() {
  const user = createAsync(() => getUser().catch(() => null));

  return (
    <nav class="main-nav">
      <div class="nav-container">
        <a href="/" class="nav-brand">
          <img src="logo.png" alt="Red Coop Central" class="nav-logo" />
        </a>
        <div class="nav-links">
          <a href="/" class="nav-link">
            Inicio
          </a>
          <a href="/about" class="nav-link">
            Acerca de
          </a>
          <Suspense
            fallback={
              <a href="/login" class="nav-link login-btn">
                Iniciar Sesión
              </a>
            }
          >
            <Show
              when={user()}
              fallback={
                <a href="/login" class="nav-link login-btn">
                  Iniciar Sesión
                </a>
              }
            >
              <div class="user-nav">
                <a href="/dashboard" class="nav-link">
                  Dashboard
                </a>
                <span class="nav-user">Hola, {user()?.username}</span>
                <form action={logout} method="post" class="nav-logout-form">
                  <button type="submit" class="nav-logout-btn">
                    Salir
                  </button>
                </form>
              </div>
            </Show>
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
