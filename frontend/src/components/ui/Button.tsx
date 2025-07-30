import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'yellow';
  width?: string;
  height?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  width = 'w-auto',
  height = 'h-7',
  className,
  children,
  ...props
}) => {
  const base = 'text-white font-medium rounded px-1 transition-colors duration-200';
  const variants: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    yellow: 'bg-yellow-500 text-white hover:bg-yellow-600',
    danger: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <button
      className={clsx(base, variants[variant], width, height, className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
