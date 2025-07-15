import { useSession } from "vinxi/http";
import { db } from "./db";
import { hashPassword, verifyPassword } from './utils/password';

// Configuración de la sesión
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

export function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

export function validateEmail(email: unknown) {
  if (typeof email !== "string" || !email.includes('@')) {
    return `Please enter a valid email address`;
  }
}

export function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
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
      throw new Error("Invalid login");
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
    if (existingUser) throw new Error("Username already exists");
    
    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) throw new Error("Email already exists");
    
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
    return false;
  }
}