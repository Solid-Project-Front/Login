import { action, query, redirect } from "@solidjs/router";
import { db } from "./db";
import {
  getSession,
  login,
  logout as logoutSession,
  register,
  validatePassword,
  validateUsername,
  validateEmail
} from "./server";

export const getUser = query(async (_, { request }) => {
  "use server";
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (!userId) {
      return redirect("/login");
    }
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      await logoutSession();
      return redirect("/login");
    }
    return { id: user.id, username: user.username, email: user.email };
  } catch (error) {
    console.error("Error getting user:", error);
    await logoutSession();
    return redirect("/login");
  }
}, "user");

export const loginOrRegister = action(async (formData: FormData) => {
  "use server";
  try {
    const username = String(formData.get("username"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const loginType = String(formData.get("loginType"));
    
    let error = validateUsername(username) || validatePassword(password);
    if (loginType === "register") {
      error = error || validateEmail(email);
    }
    if (error) return new Error(error);

    const user = await (loginType !== "login"
      ? register(username, email, password)
      : login(username, password));
    
    const session = await getSession();
    await session.update(d => {
      d.userId = user.id;
      d.username = user.username;
      d.lastLogin = new Date().toISOString();
    });

    const redirectTo = formData.get("redirectTo")?.toString() || "/";
    return redirect(redirectTo);
  } catch (error) {
    console.error("Error in loginOrRegister:", error);
    return error instanceof Error ? error : new Error("Error en el proceso de login/registro");
  }
});

export const logout = action(async () => {
  "use server";
  try {
    await logoutSession();
    return redirect("/login");
  } catch (error) {
    console.error("Error during logout:", error);
    return new Error("Error al cerrar sesión");
  }
});