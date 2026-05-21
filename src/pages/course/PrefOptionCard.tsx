import type { ReactNode } from 'react';
import { textStyles } from '@/styles/tokens';
import { ChevronRightIcon } from './icons';

type Props = {
  iconBgClassName: string;
  iconColorClassName: string;
  icon: ReactNode;
  title: string;
  selectedLabel?: string | null;
  onClick?: () => void;
};

export default function PrefOptionCard({
  iconBgClassName,
  iconColorClassName,
  icon,
  title,
  selectedLabel,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[60px] w-full items-center gap-3 rounded-[10px] border border-gray-200 bg-surface-white px-4 transition-colors duration-500 ease-out active:border-primary"
    >
      <span
        className={`grid size-[30px] shrink-0 place-items-center rounded-[5px] ${iconBgClassName}`}
      >
        <span className={`block size-5 ${iconColorClassName}`}>{icon}</span>
      </span>
      <span className={`text-text-primary ${textStyles['body-medium-med']}`}>
        {title}
      </span>
      <span className="flex-1" />
      {selectedLabel && (
        <span className={`text-gray-500 ${textStyles['body-small']}`}>
          {selectedLabel}
        </span>
      )}
      <span className="block size-[14px] text-text-primary">
        <ChevronRightIcon />
      </span>
    </button>
  );
}
