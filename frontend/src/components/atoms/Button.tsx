import type { ButtonHTMLAttributes } from 'react';
import './atomsCSS/Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined';
}

const Button = ({
  variant = 'contained',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) => (
  <button {...props} type={type} className={`button button--${variant} ${className}`.trim()} />
);

export default Button;
