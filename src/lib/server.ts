import { useSession } from "vinxi/http";
import { db } from "./db";
import { hashPassword, verifyPassword } from './utils/password';
import { sendPasswordResetEmail } from './services/email';
import { validateUsername, validateEmail, validatePassword, validatePasswordLogin } from './utils/validation';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants/messages';
import { APP_CONFIG, getEnvVar } from './constants/config';

function validateStringInput(input: unknown, validator: (str: string) => { isValid: boolean; message?: string }, fieldName: string) {
  if (typeof input !== "string") {
    return `${fieldName} debe ser una cadena de texto`;
  }
  const result = validator(input);
  return result.isValid ? undefined : result.message;
}

export function validateUsernameInput(username: unknown) {
  return validateStringInput(username, validateUsername, "El nombre de usuario");
}

export function validateEmailInput(email: unknown) {
  return validateStringInput(email, validateEmail, "El email");
}

export function validatePasswordInput(password: unknown) {
  return validateStringInput(password, validatePassword, "La contraseña");
}

export function validatePasswordInputLogin(password: unknown) {
  return validateStringInput(password, validatePasswordLogin, "La contraseña");
}

export async function login(identifier: string, password: string) {
  try {
    // Usar métodos más específicos para mejor legibilidad
    const user = identifier.includes("@") 
      ? await db.user.findByEmail(identifier)
      : await db.user.findByUsername(identifier);
      
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
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
    // Verificar si el usuario ya existe
    const existingUser = await db.user.findByUsername(username);
    if (existingUser) throw new Error(ERROR_MESSAGES.USERNAME_EXISTS);
    
    // Verificar si el email ya está registrado
    const existingEmail = await db.user.findByEmail(email);
    if (existingEmail) throw new Error(ERROR_MESSAGES.EMAIL_EXISTS);
    
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

export function getSession(rememberMe: boolean = false) {
  try {
    const sessionConfig: any = {
      name: APP_CONFIG.SESSION.NAME,
      password: getEnvVar("SESSION_SECRET", APP_CONFIG.SESSION.DEFAULT_SECRET)
    };
    
    // Solo agregar maxAge si el usuario quiere ser recordado
    if (rememberMe) {
      sessionConfig.maxAge = APP_CONFIG.SESSION.MAX_AGE_REMEMBER;
    }
    // Si no se marca "Recordarme", la sesión será del navegador (sin maxAge)
    
    return useSession(sessionConfig);
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
  // Generar un token criptográficamente seguro
  const crypto = require('crypto');
  return crypto.randomBytes(APP_CONFIG.TOKEN.LENGTH).toString('hex');
}

export async function requestPasswordReset(email: string) {
  try {
    const user = await db.user.findByEmail(email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return { success: true, message: ERROR_MESSAGES.PASSWORD_RESET_ERROR };
    }

    const token = generateResetToken();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + APP_CONFIG.TOKEN.RESET_PASSWORD_EXPIRY_HOURS);

    await db.user.setResetToken(email, token, expiry);

    // Enviar email de recuperación
    const emailSent = await sendPasswordResetEmail(email, user.username, token);
    
    if (emailSent) {
      console.log(`Password reset email sent to ${email}`);
      return { 
        success: true, 
        message: SUCCESS_MESSAGES.PASSWORD_RESET_SENT
      };
    } else {
      console.warn(`Failed to send password reset email to ${email}`);
      // Aún así devolvemos éxito para no revelar si el email existe
      return { 
        success: true, 
        message: SUCCESS_MESSAGES.PASSWORD_RESET_GENERIC
      };
    }
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw new Error("Error al procesar la solicitud de recuperación");
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const user = await db.user.findByResetToken(token);
    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }

    const hashedPassword = await hashPassword(newPassword);
    // Usar transacción para actualizar contraseña y limpiar token
    await db.user.resetUserPassword(user.id, hashedPassword);

    return { success: true, message: SUCCESS_MESSAGES.PASSWORD_UPDATED };
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}