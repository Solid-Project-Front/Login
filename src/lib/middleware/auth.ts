import { redirect } from "@solidjs/router";
import { isAuthenticated } from "../server";
// este middleware se encarga de verificar si el usuario está autenticado o no
export async function requireAuth() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return redirect("/login");
    }
  } catch (error) {
    return redirect("/login");
  }
}

export async function requireGuest() {
  try {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      return redirect("/");
    }
  } catch (error) {
    // Si hay un error al verificar la autenticación, permitimos continuar como invitado
    return;
  }
} 