// Configuración centralizada de la aplicación
export const APP_CONFIG = {
  // Configuración de sesión
  SESSION: {
    NAME: "solid_session",
    MAX_AGE: undefined, // Sin tiempo límite (sesión del navegador)
    MAX_AGE_REMEMBER: 30 * 24 * 60 * 60 * 1000, // 30 días en milisegundos
    DEFAULT_SECRET: "areallylongsecretthatyoushouldreplace"
  },

  // Configuración de rate limiting
  RATE_LIMIT: {
    LOGIN: {
      MAX_ATTEMPTS: 5,
      WINDOW_MS: 15 * 60 * 1000, // 15 minutos
      BLOCK_DURATION_MS: 30 * 60 * 1000 // 30 minutos
    },
    PASSWORD_RESET: {
      MAX_ATTEMPTS: 3,
      WINDOW_MS: 60 * 60 * 1000, // 1 hora
      BLOCK_DURATION_MS: 60 * 60 * 1000 // 1 hora
    }
  },

  // Configuración de validación
  VALIDATION: {
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 20,
      PATTERN: /^[a-zA-Z0-9_]+$/
    },
    PASSWORD: {
      MIN_LENGTH: 6,
      MAX_LENGTH: 100
    },
    EMAIL: {
      MAX_LENGTH: 254,
      PATTERN: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    }
  },

  // Configuración de tokens
  TOKEN: {
    RESET_PASSWORD_EXPIRY_HOURS: 1,
    LENGTH: 32 // bytes para el token de reset
  },

  // Configuración de base de datos
  DATABASE: {
    FILE_PATH: "sqlite.db"
  },

  // Configuración de email
  EMAIL: {
    DEFAULT_FROM: "Red Coop Central <noreply@redcoopcentral.com>",
    SMTP: {
      GMAIL: {
        HOST: "smtp.gmail.com",
        PORT: 587
      }
    }
  },

  // URLs por defecto
  URLS: {
    DEFAULT_APP_URL: "http://localhost:3000",
    LOGIN_REDIRECT: "/login",
    HOME_REDIRECT: "/"
  }
} as const;

// Función helper para obtener variables de entorno con valores por defecto
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue!;
}

// Función helper para obtener variables de entorno opcionales
export function getOptionalEnvVar(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}