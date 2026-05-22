import { ReactNode, useId } from 'react';
import { textStyles } from '@/styles/tokens';
import { InputBox, type InputBoxProps } from './InputBox';

export interface InputProps extends InputBoxProps {
  label: ReactNode;
}

export function Input({
  label,
  id: idProp,
  className = '',
  ...rest
}: InputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <div className={`flex w-80 flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={id}
        className={`${textStyles['body-medium']} px-2.5 text-black`}
      >
        {label}
      </label>
      <InputBox id={id} className="w-full" {...rest} />
    </div>
  );
}
