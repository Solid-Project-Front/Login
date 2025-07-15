import { createSignal, createEffect } from "solid-js";
import { validateForm, type FormErrors } from "../utils/validation";

export interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useFormValidation(isRegister: () => boolean) {
  const [formData, setFormData] = createSignal<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = createSignal<FormErrors>({});
  const [touched, setTouched] = createSignal<Record<string, boolean>>({});
  
  // Validar en tiempo real cuando cambian los datos
  createEffect(() => {
    const data = formData();
    const validationErrors = validateForm({
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      isRegister: isRegister()
    });
    setErrors(validationErrors);
  });
  
  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const markFieldAsTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };
  
  const isFieldValid = (field: keyof FormErrors) => {
    return !errors()[field];
  };
  
  const shouldShowError = (field: string): boolean => {
    return Boolean(touched()[field] && errors()[field as keyof FormErrors]);
  };
  
  const isFormValid = () => {
    const currentErrors = errors();
    const data = formData();
    
    // Verificar que no hay errores
    const hasErrors = Object.values(currentErrors).some(error => error);
    
    // Verificar que los campos requeridos están llenos
    const hasRequiredFields = data.username && data.password;
    const hasRegisterFields = !isRegister() || (data.email && data.confirmPassword);
    
    return !hasErrors && hasRequiredFields && hasRegisterFields;
  };
  
  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setTouched({});
  };
  
  return {
    formData,
    errors,
    touched,
    updateField,
    markFieldAsTouched,
    isFieldValid,
    shouldShowError,
    isFormValid,
    resetForm
  };
}