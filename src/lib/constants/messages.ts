// Mensajes de error y éxito centralizados
export const ERROR_MESSAGES = {
  // Validación
  REQUIRED_FIELD: (field: string) => `${field} es requerido`,
  INVALID_EMAIL: "Por favor ingresa un email válido",
  INVALID_USERNAME: "El nombre de usuario solo puede contener letras, números y guiones bajos",
  USERNAME_TOO_SHORT: (min: number) => `El nombre de usuario debe tener al menos ${min} caracteres`,
  USERNAME_TOO_LONG: (max: number) => `El nombre de usuario no puede tener más de ${max} caracteres`,
  PASSWORD_TOO_SHORT: (min: number) => `La contraseña debe tener al menos ${min} caracteres`,
  PASSWORD_TOO_LONG: (max: number) => `La contraseña no puede tener más de ${max} caracteres`,
  PASSWORD_REQUIREMENTS: "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
  PASSWORDS_DONT_MATCH: "Las contraseñas no coinciden",
  
  // Autenticación
  INVALID_CREDENTIALS: "Usuario o contraseña incorrectos",
  USERNAME_EXISTS: "El nombre de usuario ya existe",
  EMAIL_EXISTS: "El email ya está registrado",
  USER_OR_EMAIL_REQUIRED: "El usuario o email es requerido",
  
  // Rate limiting
  TOO_MANY_LOGIN_ATTEMPTS: (remaining: number) => 
    remaining > 0 
      ? `Credenciales incorrectas. Te quedan ${remaining} intentos.`
      : "Demasiados intentos fallidos.",
  ACCOUNT_BLOCKED: (minutes: number) => 
    `Demasiados intentos fallidos. Intenta de nuevo en ${minutes} minutos.`,
  TOO_MANY_RESET_REQUESTS: (minutes: number) => 
    `Demasiadas solicitudes de recuperación. Intenta de nuevo en ${minutes} minutos.`,
  
  // Recuperación de contraseña
  INVALID_OR_EXPIRED_TOKEN: "Token inválido o expirado",
  
  // Errores generales
  GENERIC_ERROR: "Ha ocurrido un error inesperado",
  LOGIN_ERROR: "Error en el proceso de login/registro",
  LOGOUT_ERROR: "Error al cerrar sesión",
  PASSWORD_RESET_ERROR: "Error al procesar la solicitud de recuperación",
  PASSWORD_UPDATE_ERROR: "Error al restablecer la contraseña"
} as const;

export const SUCCESS_MESSAGES = {
  PASSWORD_RESET_SENT: "Se ha enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada y carpeta de spam.",
  PASSWORD_RESET_GENERIC: "Si el email existe, recibirás un enlace de recuperación en tu bandeja de entrada",
  PASSWORD_UPDATED: "Contraseña actualizada exitosamente",
  PASSWORD_RESET_SUCCESS: "Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión."
} as const;