import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  width?: string;
  height?: string;
  placeholder?: string;
}

// forwardRef 支援 ref 傳遞
const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  value,
  onChange,
  placeholder = '請選擇',
  width = 'w-full',
  height = 'h-10',
  className = '',
  ...rest
}, ref) => {
  const baseStyle =
    'px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 ' +
    'bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ' +
    'transition duration-150 ease-in-out';

  return (
    <select
      ref={ref}
      value={value}
      onChange={onChange}
      className={clsx(baseStyle, width, height, className)}
      {...rest}
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = 'Select'; // 讓 DevTools 顯示名稱

export default Select;
