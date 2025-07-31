import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: string;
  height?: string;
}

const Input: React.FC<InputProps> = ({
  width = 'w-full',
  height = 'h-10',
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = '',
}) => {
  const base = 'px-3 py-& border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400';
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={clsx(base, width, height, className)}
    />
  );
};

export default Input;
