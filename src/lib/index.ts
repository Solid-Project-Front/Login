import { action, query, redirect } from "@solidjs/router";
import { db } from "./db";
import {
  getSession,
  login,
  logout as logoutSession,
  register,
  validatePassword,
  validateUsername,
  validateEmail,
  requestPasswordReset,
  resetPassword
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

    const user = await (loginType === "register"
      ? register(username, email, password)
      : login(username, password));
    
    const session = await getSession();
    await session.update((data) => {
      data.userId = user.id;
      data.username = user.username;
      data.lastLogin = new Date().toISOString();
      return data;
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

export const forgotPassword = action(async (formData: FormData) => {
  "use server";
  try {
    const email = String(formData.get("email"));
    
    const emailError = validateEmail(email);
    if (emailError) return new Error(emailError);

    const result = await requestPasswordReset(email);
    return result;
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return error instanceof Error ? error : new Error("Error al procesar la solicitud");
  }
});

export const resetPasswordAction = action(async (formData: FormData) => {
  "use server";
  try {
    const token = String(formData.get("token"));
    const password = String(formData.get("password"));
    
    const passwordError = validatePassword(password);
    if (passwordError) return new Error(passwordError);

    const result = await resetPassword(token, password);
    if (result.success) {
      return redirect("/login?message=password-reset-success");
    }
    return result;
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return error instanceof Error ? error : new Error("Error al restablecer la contraseña");
  }
});