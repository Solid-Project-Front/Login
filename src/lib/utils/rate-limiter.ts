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

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000, blockDurationMs = 30 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs; // 15 minutos
    this.blockDurationMs = blockDurationMs; // 30 minutos de bloqueo
  }

  isBlocked(identifier: string): boolean {
    const entry = this.attempts.get(identifier);
    if (!entry) return false;

    const now = new Date();
    
    // Si está bloqueado y el bloqueo no ha expirado
    if (entry.blockedUntil && entry.blockedUntil > now) {
      return true;
    }

    // Si el bloqueo ha expirado, limpiar la entrada
    if (entry.blockedUntil && entry.blockedUntil <= now) {
      this.attempts.delete(identifier);
      return false;
    }

    return false;
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

// Instancias globales para diferentes tipos de rate limiting
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000, 30 * 60 * 1000); // 5 intentos en 15 min, bloqueo 30 min
export const passwordResetRateLimiter = new RateLimiter(3, 60 * 60 * 1000, 60 * 60 * 1000); // 3 intentos en 1 hora, bloqueo 1 hora

// Limpiar entradas expiradas cada 10 minutos
setInterval(() => {
  loginRateLimiter.cleanup();
  passwordResetRateLimiter.cleanup();
}, 10 * 60 * 1000);