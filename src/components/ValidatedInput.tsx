import { JSX, Show } from "solid-js";
import { PasswordStrength } from "./PasswordStrength";

interface ValidatedInputProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  showError: boolean;
  required?: boolean;
  disabled?: boolean;
  onInput: (value: string) => void;
  onBlur: () => void;
  class?: string;
  showPasswordStrength?: boolean;
}

export function ValidatedInput(props: ValidatedInputProps) {
  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    props.onInput(e.currentTarget.value);
  };

  const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = () => {
    props.onBlur();
  };

  const isPasswordField = () => props.type === "password" && props.showPasswordStrength;
  const hasError = () => props.showError && props.error;
  const isValid = () => !props.error && props.value.length > 0;

  return (
    <div class="input-group">
      <label for={props.id} class="input-label">
        {props.placeholder}
        {props.required && <span class="required-asterisk">*</span>}
      </label>
      <input
        id={props.id}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        required={props.required}
        disabled={props.disabled}
        onInput={handleInput}
        onBlur={handleBlur}
        class={`validated-input ${props.class || ''}`}
        classList={{
          'has-error': hasError(),
          'is-valid': isValid()
        }}
      />
      <Show when={isPasswordField() && props.value.length > 0}>
        <PasswordStrength password={props.value} />
      </Show>
      <Show when={props.showError && props.error}>
        <div class="error-message" role="alert">
          {props.error}
        </div>
      </Show>
    </div>
  );
}