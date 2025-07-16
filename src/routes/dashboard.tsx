import { createAsync, type RouteDefinition, redirect } from "@solidjs/router";
import { getUser, logout } from "~/lib";
import { Show, Suspense, createEffect } from "solid-js";

export const route = {
  preload() { getUser() }
} satisfies RouteDefinition;

export default function Dashboard() {
  const user = createAsync(() => getUser());
  
  // Redirigir al login si no hay usuario autenticado
  createEffect(() => {
    if (user() === null) {
      window.location.href = "/login";
    }
  });
  
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
            
            <div class="dashboard-content">
              <div class="dashboard-cards">
                <div class="dashboard-card">
                  <h3>Mi Cooperativa</h3>
                  <p>Gestiona la información de tu cooperativa</p>
                  <button class="card-button">Ver Detalles</button>
                </div>
                
                <div class="dashboard-card">
                  <h3>Conexiones</h3>
                  <p>Conecta con otras cooperativas</p>
                  <button class="card-button">Explorar Red</button>
                </div>
                
                <div class="dashboard-card">
                  <h3>Recursos</h3>
                  <p>Accede a herramientas y recursos</p>
                  <button class="card-button">Ver Recursos</button>
                </div>
                
                <div class="dashboard-card">
                  <h3>Reportes</h3>
                  <p>Genera reportes y estadísticas</p>
                  <button class="card-button">Ver Reportes</button>
                </div>
              </div>
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