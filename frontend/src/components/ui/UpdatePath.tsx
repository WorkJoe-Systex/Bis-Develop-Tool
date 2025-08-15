import React from 'react';
import Input from './Input';
import Button from './Button';

// 子組件：可重複使用的表單
interface PathFormProps {
  label: string;
  value: string;
  inputWidth?: string;
  inputHeight?: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => Promise<void>;
  haveBTN?: boolean;
}

const PathForm: React.FC<PathFormProps> = ({
  label,
  value,
  inputWidth = 'w-100',
  inputHeight = 'h-8',
  onChange,
  onSubmit,
  haveBTN = true
}) => (
  <form onSubmit={onSubmit} className="flex items-center gap-4 mb-4">
    <label className="w-36 text-right text-gray-700">{label}：</label>
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${label.toLowerCase()}`}
      width={inputWidth}
      height={inputHeight}
    />
    {haveBTN && (
      <Button type="submit" variant="primary">
        更新
      </Button>
    )}
  </form>
);

export default PathForm;
