import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: string;
  height?: string;
  className?: string;
}

// 使用 forwardRef 正確傳遞 ref
const Input = forwardRef<HTMLInputElement, InputProps>(({
  width = 'w-full',
  height = 'h-10',
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = '',
  ...rest
}, ref) => {
  const baseStyle =
  'px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 ' +
  'bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ' +
  'transition duration-150 ease-in-out ' +
  'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed';

  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={clsx(baseStyle, width, height, className)}
      {...rest}
    />
  );
});

Input.displayName = 'Input'; // for React DevTools

export default Input;
