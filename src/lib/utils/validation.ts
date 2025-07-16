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

export const ValidationRules = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  password: {
    minLength: 6,
    maxLength: 100
  },
  email: {
    pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    maxLength: 254
  }
};

export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { isValid: false, message: "El nombre de usuario es requerido" };
  }
  
  if (username.length < ValidationRules.username.minLength) {
    return { isValid: false, message: `El nombre de usuario debe tener al menos ${ValidationRules.username.minLength} caracteres` };
  }
  
  if (username.length > ValidationRules.username.maxLength) {
    return { isValid: false, message: `El nombre de usuario no puede tener más de ${ValidationRules.username.maxLength} caracteres` };
  }
  
  if (!ValidationRules.username.pattern.test(username)) {
    return { isValid: false, message: "El nombre de usuario solo puede contener letras, números y guiones bajos" };
  }
  
  return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, message: "El email es requerido" };
  }
  
  if (email.length > ValidationRules.email.maxLength) {
    return { isValid: false, message: `El email no puede tener más de ${ValidationRules.email.maxLength} caracteres` };
  }
  
  if (!ValidationRules.email.pattern.test(email)) {
    return { isValid: false, message: "Por favor ingresa un email válido" };
  }
  
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, message: "La contraseña es requerida" };
  }
  
  if (password.length < ValidationRules.password.minLength) {
    return { isValid: false, message: `La contraseña debe tener al menos ${ValidationRules.password.minLength} caracteres` };
  }
  
  if (password.length > ValidationRules.password.maxLength) {
    return { isValid: false, message: `La contraseña no puede tener más de ${ValidationRules.password.maxLength} caracteres` };
  }
  
  // Validaciones adicionales de seguridad
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { 
      isValid: false, 
      message: "La contraseña debe contener al menos una mayúscula, una minúscula y un número" 
    };
  }
  
  return { isValid: true };
}

export function validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, message: "Confirma tu contraseña" };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: "Las contraseñas no coinciden" };
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
      errors.username = "El usuario o email es requerido";
    }
  }
  
  if (formData.isRegister && formData.email) {
    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) {
      errors.email = emailResult.message;
    }
  }
  
  const passwordResult = validatePassword(formData.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.message;
  }
  
  if (formData.isRegister && formData.confirmPassword) {
    const confirmResult = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!confirmResult.isValid) {
      errors.confirmPassword = confirmResult.message;
    }
  }
  
  return errors;
}