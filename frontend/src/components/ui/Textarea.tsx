import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  width?: string;
  height?: string;
  className?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ width = 'w-full', height = 'h-32', className = '', ...rest }, ref) => {
    const baseStyle =
      'px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 ' +
      'bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ' +
      'transition duration-150 ease-in-out resize-none overflow-auto';

    return (
      <textarea
        ref={ref}
        className={clsx(baseStyle, width, height, className)}
        {...rest}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
