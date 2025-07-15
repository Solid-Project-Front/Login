import { createMemo } from "solid-js";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength(props: PasswordStrengthProps) {
  const strength = createMemo(() => {
    const password = props.password;
    if (!password) return { level: 0, text: "" };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Puntuación basada en criterios
    if (checks.length) score += 2;
    if (checks.lowercase) score += 1;
    if (checks.uppercase) score += 1;
    if (checks.numbers) score += 1;
    if (checks.symbols) score += 2;
    
    // Bonificación por longitud extra
    if (password.length >= 12) score += 1;
    
    if (score <= 3) return { level: 1, text: "Débil" };
    if (score <= 5) return { level: 2, text: "Media" };
    return { level: 3, text: "Fuerte" };
  });
  
  const getStrengthClass = () => {
    switch (strength().level) {
      case 1: return "strength-weak";
      case 2: return "strength-medium";
      case 3: return "strength-strong";
      default: return "";
    }
  };
  
  return (
    <div class="password-strength">
      <div class={`strength-bar ${getStrengthClass()}`}>
        <div class="strength-fill"></div>
      </div>
      <div class="strength-text">
        Fortaleza: {strength().text}
      </div>
    </div>
  );
}