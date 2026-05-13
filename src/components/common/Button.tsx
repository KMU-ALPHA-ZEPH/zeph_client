import type { ButtonHTMLAttributes, Ref } from 'react';
import { textStyles } from '@/styles/tokens';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  inactive?: boolean;
}

export function Button({
  className = '',
  type = 'button',
  inactive = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled ?? inactive}
      className={`flex w-80 items-center justify-center rounded-[5px] bg-black px-[18px] py-2.5 text-white transition-transform ${textStyles['body-medium']} ${inactive ? 'opacity-40' : 'active:scale-[0.97]'} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
