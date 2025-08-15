import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'yellow' | 'success';
  className?: string;
  width?: string;
  height?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  width = 'w-auto',
  height = 'h-7',
  ...props
}) => {
  // const base = 'text-white font-medium rounded px-1 transition-colors duration-200';
  const base = 'px-3 rounded text-sm shadow';
  const variants: Record<string, string> = {
    primary:    'bg-blue-500    hover:bg-blue-600     text-white',
    secondary:  'bg-gray-600    hover:bg-gray-700     text-white',
    yellow:     'bg-yellow-500  hover:bg-yellow-600   text-white',
    success:    'bg-emerald-500 hover:bg-emerald-600  text-white',
    danger:     'bg-red-600     hover:bg-red-700      text-white',
  };

  return (
    <button
      {...props}
      className={clsx(base, variants[variant], width, height, className)}
    >
      {children}
    </button>
  );
};

export default Button;
