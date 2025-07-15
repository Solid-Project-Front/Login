// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <>
          <nav class="main-nav">
            <div class="nav-container">
              <a href="/" class="nav-brand">
                <img src="logo.png" alt="Red Coop Central" class="nav-logo" />
              </a>
              <div class="nav-links">
                <a href="/" class="nav-link">Inicio</a>
                <a href="/about" class="nav-link">Acerca de</a>
              </div>
            </div>
          </nav>
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
