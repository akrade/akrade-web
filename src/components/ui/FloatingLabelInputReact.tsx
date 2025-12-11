import React, { useState } from 'react';
import { KradoInput } from '@akrade/krado-ui';

interface FloatingLabelInputReactProps {
  name: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  autocomplete?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * FloatingLabelInputReact Component
 *
 * Wraps @akrade/krado-ui's KradoInput with Material Design 3 floating label behavior.
 * Uses KradoInput from @akrade/krado-ui (built on @mui/base) with custom floating label overlay.
 */
export default function FloatingLabelInputReact({
  name,
  type = 'text',
  label,
  placeholder = '',
  required = false,
  value = '',
  autocomplete,
  className = '',
  disabled = false,
}: FloatingLabelInputReactProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Determine if label should float
  const shouldFloat = isFocused || !!inputValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Generate unique ID using React.useId()
  const inputId = `floating-${name}-${React.useId()}`;

  return (
    <div className={`floating-input-krado-wrapper ${className}`}>
      <div className="floating-input-inner">
        <KradoInput
          id={inputId}
          name={name}
          type={type}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? placeholder : ''}
          required={required}
          autoComplete={autocomplete}
          disabled={disabled}
          className="floating-krado-input"
          aria-label={label}
          // Don't pass label prop - we'll render our own floating label
        />
        <label
          htmlFor={inputId}
          className={`floating-krado-label ${shouldFloat ? 'floating-krado-label--floated' : ''}`}
        >
          {label}
          {!required && <span className="optional-indicator"> (optional)</span>}
        </label>
      </div>
    </div>
  );
}
