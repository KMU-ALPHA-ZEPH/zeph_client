import React, { InputHTMLAttributes, Ref } from 'react';
import { textStyles } from '@/styles/tokens';

export interface InputBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
  strokeNone?: boolean;
}

export function InputBox({
  className = '',
  strokeNone = false,
  ...rest
}: InputBoxProps) {
  const variant = strokeNone
    ? 'bg-surface-white opacity-70'
    : 'border border-gray-500/50 bg-surface-white';

  return (
    <input
      type="text"
      className={`h-10 w-80 rounded-[5px] px-[18px] placeholder:text-text-placeholder focus:outline-none ${variant} ${textStyles['body-small']} ${className}`}
      {...rest}
    />
  );
}

// 사용예시
// <InputBox placeholder="비밀번호" type="password" />
//   <InputBox placeholder="가로 꽉 채우기" className="w-full" />
// <InputBox placeholder="이름" />
// // 디폴트: gray-500/50 보더 + 흰배경 100%
// <InputBox placeholder="이름" strokeNone />
// // 보더 없음 + 배경 70% (이전 모습)
