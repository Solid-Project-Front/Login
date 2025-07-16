import { APP_CONFIG } from '../constants/config';

// Sistema simple de rate limiting en memoria
// En producción se debería usar Redis o una base de datos

interface RateLimitEntry {
  attempts: number;
  lastAttempt: Date;
  blockedUntil?: Date;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly blockDurationMs: number;

  constructor(maxAttempts: number, windowMs: number, blockDurationMs: number) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
  }

  isBlocked(identifier: string): boolean {
    const entry = this.attempts.get(identifier);
    if (!entry?.blockedUntil) return false;

    const now = new Date();
    
    // Si el bloqueo ha expirado, limpiar la entrada
    if (entry.blockedUntil <= now) {
      this.attempts.delete(identifier);
      return false;
    }

    // Si está bloqueado y el bloqueo no ha expirado
    return true;
  }

  recordAttempt(identifier: string, success: boolean): void {
    const now = new Date();
    const entry = this.attempts.get(identifier);

    if (success) {
      // Si el intento fue exitoso, limpiar el registro
      this.attempts.delete(identifier);
      return;
    }

    if (!entry) {
      // Primer intento fallido
      this.attempts.set(identifier, {
        attempts: 1,
        lastAttempt: now
      });
      return;
    }

    // Verificar si estamos dentro de la ventana de tiempo
    const timeSinceLastAttempt = now.getTime() - entry.lastAttempt.getTime();
    
    if (timeSinceLastAttempt > this.windowMs) {
      // Fuera de la ventana, reiniciar contador
      this.attempts.set(identifier, {
        attempts: 1,
        lastAttempt: now
      });
      return;
    }

    // Incrementar intentos
    const newAttempts = entry.attempts + 1;
    
    if (newAttempts >= this.maxAttempts) {
      // Bloquear usuario
      this.attempts.set(identifier, {
        attempts: newAttempts,
        lastAttempt: now,
        blockedUntil: new Date(now.getTime() + this.blockDurationMs)
      });
    } else {
      this.attempts.set(identifier, {
        attempts: newAttempts,
        lastAttempt: now
      });
    }
  }

  getRemainingAttempts(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry) return this.maxAttempts;

    const now = new Date();
    const timeSinceLastAttempt = now.getTime() - entry.lastAttempt.getTime();
    
    // Si estamos fuera de la ventana de tiempo, reiniciar
    if (timeSinceLastAttempt > this.windowMs) {
      return this.maxAttempts;
    }

    return Math.max(0, this.maxAttempts - entry.attempts);
  }

  getBlockedUntil(identifier: string): Date | null {
    const entry = this.attempts.get(identifier);
    return entry?.blockedUntil || null;
  }

  // Limpiar entradas expiradas (llamar periódicamente)
  cleanup(): void {
    const now = new Date();
    for (const [key, entry] of this.attempts.entries()) {
      const timeSinceLastAttempt = now.getTime() - entry.lastAttempt.getTime();
      
      // Limpiar entradas antiguas o bloqueos expirados
      if (timeSinceLastAttempt > this.windowMs && (!entry.blockedUntil || entry.blockedUntil <= now)) {
        this.attempts.delete(key);
      }
    }
  }
}

// Instancias globales para diferentes tipos de rate limiting usando configuración centralizada
export const loginRateLimiter = new RateLimiter(
  APP_CONFIG.RATE_LIMIT.LOGIN.MAX_ATTEMPTS,
  APP_CONFIG.RATE_LIMIT.LOGIN.WINDOW_MS,
  APP_CONFIG.RATE_LIMIT.LOGIN.BLOCK_DURATION_MS
);

export const passwordResetRateLimiter = new RateLimiter(
  APP_CONFIG.RATE_LIMIT.PASSWORD_RESET.MAX_ATTEMPTS,
  APP_CONFIG.RATE_LIMIT.PASSWORD_RESET.WINDOW_MS,
  APP_CONFIG.RATE_LIMIT.PASSWORD_RESET.BLOCK_DURATION_MS
);

// Limpiar entradas expiradas cada 10 minutos
setInterval(() => {
  loginRateLimiter.cleanup();
  passwordResetRateLimiter.cleanup();
}, 10 * 60 * 1000);