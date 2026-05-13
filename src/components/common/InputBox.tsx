import React, { ChangeEvent, InputHTMLAttributes, Ref, useState } from 'react';
import { textStyles } from '@/styles/tokens';

export interface InputBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
  strokeNone?: boolean;
}

export function InputBox({
  className = '',
  strokeNone = false,
  onChange,
  value,
  defaultValue,
  ...rest
}: InputBoxProps) {
  const [hasValue, setHasValue] = useState(Boolean(value ?? defaultValue));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    onChange?.(e);
  };

  const variant = strokeNone
    ? `bg-surface-white focus:opacity-90 ${
        hasValue ? 'opacity-70' : 'opacity-70'
      }`
    : `border bg-surface-white focus:border-primary/50 ${
        hasValue ? 'border-black/50' : 'border-gray-500/50'
      }`;

  return (
    <input
      type="text"
      className={`h-10 w-80 rounded-[5px] px-[18px] placeholder:text-text-placeholder focus:outline-none ${variant} ${textStyles['body-small']} ${className}`}
      onChange={handleChange}
      value={value}
      defaultValue={defaultValue}
      {...rest}
    />
  );
}

// 사용예시
// <InputBox placeholder="비밀번호" type="password" />
//  <InputBox placeholder="가로 꽉 채우기" className="w-full" />
// <InputBox placeholder="이름" />
// <InputBox placeholder="이름" strokeNone />
