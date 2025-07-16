import { ERROR_MESSAGES } from "../constants/messages";
import { APP_CONFIG } from "../constants/config";

// Utilidades de validación compartidas entre cliente y servidor
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Usar configuración centralizada
export const ValidationRules = APP_CONFIG.VALIDATION;

export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.REQUIRED_FIELD("El nombre de usuario"),
    };
  }

  if (username.length < ValidationRules.USERNAME.MIN_LENGTH) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.USERNAME_TOO_SHORT(
        ValidationRules.USERNAME.MIN_LENGTH
      ),
    };
  }

  if (username.length > ValidationRules.USERNAME.MAX_LENGTH) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.USERNAME_TOO_LONG(
        ValidationRules.USERNAME.MAX_LENGTH
      ),
    };
  }

  if (!ValidationRules.USERNAME.PATTERN.test(username)) {
    return { isValid: false, message: ERROR_MESSAGES.INVALID_USERNAME };
  }

  return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.REQUIRED_FIELD("El email"),
    };
  }

  if (email.length > ValidationRules.EMAIL.MAX_LENGTH) {
    return {
      isValid: false,
      message: `El email no puede tener más de ${ValidationRules.EMAIL.MAX_LENGTH} caracteres`,
    };
  }

  if (!ValidationRules.EMAIL.PATTERN.test(email)) {
    return { isValid: false, message: ERROR_MESSAGES.INVALID_EMAIL };
  }

  return { isValid: true };
}

// Validación básica de contraseña para login (solo verifica que no esté vacía)
export function validatePasswordLogin(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.REQUIRED_FIELD("La contraseña"),
    };
  }

  return { isValid: true };
}

// Validación completa de contraseña para registro (con todos los requisitos)
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.REQUIRED_FIELD("La contraseña"),
    };
  }

  if (password.length < ValidationRules.PASSWORD.MIN_LENGTH) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.PASSWORD_TOO_SHORT(
        ValidationRules.PASSWORD.MIN_LENGTH
      ),
    };
  }

  if (password.length > ValidationRules.PASSWORD.MAX_LENGTH) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.PASSWORD_TOO_LONG(
        ValidationRules.PASSWORD.MAX_LENGTH
      ),
    };
  }

  // Validaciones adicionales de seguridad
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.PASSWORD_REQUIREMENTS,
    };
  }

  return { isValid: true };
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword) {
    return {
      isValid: false,
      message: ERROR_MESSAGES.REQUIRED_FIELD("Confirma tu contraseña"),
    };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: ERROR_MESSAGES.PASSWORDS_DONT_MATCH };
  }

  return { isValid: true };
}

export function validateForm(formData: {
  username: string;
  email?: string;
  password: string;
  confirmPassword?: string;
  isRegister: boolean;
}): FormErrors {
  const errors: FormErrors = {};

  // Solo validar username en modo registro
  if (formData.isRegister) {
    const usernameResult = validateUsername(formData.username);
    if (!usernameResult.isValid) {
      errors.username = usernameResult.message;
    }
  } else {
    // En modo login, solo verificar que el campo no esté vacío
    if (!formData.username || formData.username.trim().length === 0) {
      errors.username = ERROR_MESSAGES.USER_OR_EMAIL_REQUIRED;
    }
  }

  if (formData.isRegister && formData.email) {
    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) {
      errors.email = emailResult.message;
    }
  }

  // Usar validación diferente según el contexto
  const passwordResult = formData.isRegister 
    ? validatePassword(formData.password)  // Validación completa para registro
    : validatePasswordLogin(formData.password);  // Validación básica para login
  
  if (!passwordResult.isValid) {
    errors.password = passwordResult.message;
  }

  if (formData.isRegister && formData.confirmPassword) {
    const confirmResult = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    if (!confirmResult.isValid) {
      errors.confirmPassword = confirmResult.message;
    }
  }

  return errors;
}
