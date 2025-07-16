import { useSession } from "vinxi/http";
import { db } from "./db";
import { hashPassword, verifyPassword } from './utils/password';
import { sendPasswordResetEmail } from './services/email';

// Configuración de la sesión
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

import { validateUsername as clientValidateUsername, validateEmail as clientValidateEmail, validatePassword as clientValidatePassword } from './utils/validation';

export function validateUsername(username: unknown) {
  if (typeof username !== "string") {
    return "El nombre de usuario debe ser una cadena de texto";
  }
  const result = clientValidateUsername(username);
  return result.isValid ? undefined : result.message;
}

export function validateEmail(email: unknown) {
  if (typeof email !== "string") {
    return "El email debe ser una cadena de texto";
  }
  const result = clientValidateEmail(email);
  return result.isValid ? undefined : result.message;
}

export function validatePassword(password: unknown) {
  if (typeof password !== "string") {
    return "La contraseña debe ser una cadena de texto";
  }
  const result = clientValidatePassword(password);
  return result.isValid ? undefined : result.message;
}

export async function login(identifier: string, password: string) {
  try {
    let user;
    if (identifier.includes("@")) {
      user = await db.user.findUnique({ where: { email: identifier } });
    } else {
      user = await db.user.findUnique({ where: { username: identifier } });
    }
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    return user;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

export async function logout() {
  try {
    const session = await getSession();
    session.data.userId = undefined; 
    session.data.username = undefined;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}

export async function register(username: string, email: string, password: string) {
  try {
    const existingUser = await db.user.findUnique({ where: { username } });
    if (existingUser) throw new Error("El nombre de usuario ya existe");
    
    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) throw new Error("El email ya está registrado");
    
    const hashedPassword = await hashPassword(password);
    return db.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

export function getSession() {
  try {
    return useSession({
      name: "solid_session",
      password: process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace",
      maxAge: SESSION_EXPIRY
    });
  } catch (error) {
    console.error("Error getting session:", error);
    throw error;
  }
}

export async function isAuthenticated() {
  try {
    const session = await getSession();
    return session.data.userId !== undefined;
  } catch (error) {
    console.error("Error checking authentication:", error);
    // En caso de error del servidor, es más seguro requerir re-autenticación
    // que asumir que el usuario no está autenticado
    throw error;
  }
}

export function generateResetToken(): string {
  // Generar un token seguro de 32 caracteres
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function requestPasswordReset(email: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return { success: true, message: "Si el email existe, recibirás un enlace de recuperación" };
    }

    const token = generateResetToken();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // Token válido por 1 hora

    await db.user.setResetToken(email, token, expiry);

    // Enviar email de recuperación
    const emailSent = await sendPasswordResetEmail(email, user.username, token);
    
    if (emailSent) {
      console.log(`Password reset email sent to ${email}`);
    } else {
      console.warn(`Failed to send password reset email to ${email}`);
    }

    // En modo desarrollo, incluir el enlace en la respuesta
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    
    return { 
      success: true, 
      message: "Si el email existe, recibirás un enlace de recuperación",
      ...(isDevelopment && { 
        developmentLink: `${appUrl}/reset-password?token=${token}`,
        developmentMessage: "Modo desarrollo: Usa el enlace de abajo para restablecer la contraseña"
      })
    };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw new Error("Error al procesar la solicitud de recuperación");
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const user = await db.user.findByResetToken(token);
    if (!user) {
      throw new Error("Token inválido o expirado");
    }

    const hashedPassword = await hashPassword(newPassword);
    await db.user.updatePassword(user.id, hashedPassword);
    await db.user.clearResetToken(user.id);

    return { success: true, message: "Contraseña actualizada exitosamente" };
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}