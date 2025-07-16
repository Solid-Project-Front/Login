import { action, query, redirect } from "@solidjs/router";
import { db } from "./db";
import {
  getSession,
  login,
  logout as logoutSession,
  register,
  validatePasswordInput,
  validatePasswordInputLogin,
  validateUsernameInput,
  validateEmailInput,
  requestPasswordReset,
  resetPassword
} from "./server";
import { loginRateLimiter, passwordResetRateLimiter } from "./utils/rate-limiter";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "./constants/messages";

export const getUser = query(async () => {
  "use server";
  try {
    const session = await getSession();
    const userId = session.data.userId;
    const rememberMe = session.data.rememberMe;
    const lastLogin = session.data.lastLogin;
    
    if (!userId) {
      return null;
    }
    
    // Si no hay rememberMe y ha pasado tiempo desde el último login,
    // verificar si es una sesión "antigua" que debería expirar
    if (rememberMe !== true && lastLogin) {
      const loginTime = new Date(lastLogin);
      const now = new Date();
      const timeDiff = now.getTime() - loginTime.getTime();
      
      // Si han pasado más de 30 minutos sin rememberMe, cerrar sesión
      // Esto permite usar la app normalmente pero expira sesiones "viejas"
      if (timeDiff > 30 * 60 * 1000) { // 30 minutos
        console.log("Cerrando sesión antigua sin rememberMe");
        await logoutSession();
        return null;
      }
    }
    
    const user = await db.user.findById(userId);
    if (!user) {
      await logoutSession();
      return null;
    }
    return { id: user.id, username: user.username, email: user.email };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}, "user");

export const loginOrRegister = action(async (formData: FormData) => {
  "use server";
  try {
    const username = String(formData.get("username"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));
    const loginType = String(formData.get("loginType"));
    const rememberMe = formData.get("rememberMe") === "on"; // Obtener la opción "Recordarme"
    
    // Para login, verificar rate limiting
    if (loginType === "login") {
      const identifier = username.toLowerCase(); // Usar username como identificador
      
      if (loginRateLimiter.isBlocked(identifier)) {
        const blockedUntil = loginRateLimiter.getBlockedUntil(identifier);
        const minutes = blockedUntil ? Math.ceil((blockedUntil.getTime() - Date.now()) / (1000 * 60)) : 30;
        return new Error(ERROR_MESSAGES.ACCOUNT_BLOCKED(minutes));
      }
    }
    
    // Usar validación de contraseña apropiada según el contexto
    let error = loginType === "register" 
      ? validatePasswordInput(password)  // Validación completa para registro
      : validatePasswordInputLogin(password);  // Validación básica para login
    
    if (loginType === "register") {
      // En registro, validar username y email por separado
      error = error || validateUsernameInput(username) || validateEmailInput(email);
      // Validar confirmación de contraseña en registro
      if (password !== confirmPassword) {
        error = error || ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
      }
    } else {
      // En login, validar que el campo no esté vacío
      if (!username?.trim()) {
        error = error || ERROR_MESSAGES.USER_OR_EMAIL_REQUIRED;
      }
    }
    if (error) return new Error(error);

    try {
      const user = await (loginType === "register"
        ? register(username, email, password)
        : login(username, password));
      
      // Si el login fue exitoso, registrar el éxito en el rate limiter
      if (loginType === "login") {
        loginRateLimiter.recordAttempt(username.toLowerCase(), true);
      }
      
      // Usar la sesión con la duración apropiada según "Recordarme"
      const session = await getSession(rememberMe);
      await session.update((data) => {
        data.userId = user.id;
        data.username = user.username;
        data.lastLogin = new Date().toISOString();
        data.rememberMe = rememberMe; // Guardar la preferencia
        return data;
      });

      const redirectTo = formData.get("redirectTo")?.toString() || "/dashboard";
      return redirect(redirectTo);
    } catch (authError) {
      // Si el login falló, registrar el intento fallido
      if (loginType === "login") {
        loginRateLimiter.recordAttempt(username.toLowerCase(), false);
        const remaining = loginRateLimiter.getRemainingAttempts(username.toLowerCase());
        if (remaining > 0) {
          return new Error(ERROR_MESSAGES.TOO_MANY_LOGIN_ATTEMPTS(remaining));
        }
      }
      throw authError;
    }
  } catch (error) {
    console.error("Error in loginOrRegister:", error);
    return error instanceof Error ? error : new Error("Error en el proceso de login/registro");
  }
});

export const logout = action(async () => {
  "use server";
  try {
    await logoutSession();
    return redirect("/");
  } catch (error) {
    console.error("Error during logout:", error);
    return new Error("Error al cerrar sesión");
  }
});

export const forgotPassword = action(async (formData: FormData) => {
  "use server";
  try {
    const email = String(formData.get("email"));
    
    const emailError = validateEmailInput(email);
    if (emailError) return new Error(emailError);

    // Verificar rate limiting para recuperación de contraseña
    const identifier = email.toLowerCase();
    
    if (passwordResetRateLimiter.isBlocked(identifier)) {
      const blockedUntil = passwordResetRateLimiter.getBlockedUntil(identifier);
      const minutes = blockedUntil ? Math.ceil((blockedUntil.getTime() - Date.now()) / (1000 * 60)) : 60;
      return new Error(ERROR_MESSAGES.TOO_MANY_RESET_REQUESTS(minutes));
    }

    // Registrar el intento (siempre como "fallido" para no revelar si el email existe)
    passwordResetRateLimiter.recordAttempt(identifier, false);

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
    const confirmPassword = String(formData.get("confirmPassword"));
    
    const passwordError = validatePasswordInput(password);
    if (passwordError) return new Error(passwordError);

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return new Error(ERROR_MESSAGES.PASSWORDS_DONT_MATCH);
    }

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