/**
 * Type declarations for @akrade/krado-ui
 * Generated types for the Krado UI component library
 */

declare module '@akrade/krado-ui' {
  import * as React from 'react';

  export interface KradoInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Label text for the input */
    label?: string;
    /** Helper text below the input */
    helperText?: string;
    /** Show error state */
    error?: boolean;
    /** Show success state */
    success?: boolean;
    /** Size of the input */
    size?: 'sm' | 'md' | 'lg';
    /** Input type */
    type?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Input value */
    value?: string;
    /** Change handler */
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    /** Focus handler */
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    /** Blur handler */
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    /** Additional CSS classes */
    className?: string;
    /** Unique ID for the input */
    id?: string;
    /** Mark input as required */
    required?: boolean;
    /** Disable the input */
    disabled?: boolean;
    /** Autocomplete attribute */
    autoComplete?: string;
  }

  export const KradoInput: React.ForwardRefExoticComponent<
    KradoInputProps & React.RefAttributes<HTMLInputElement>
  >;

  export interface KradoButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'outline';
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    className?: string;
  }

  export const KradoButton: React.FC<KradoButtonProps>;
}
