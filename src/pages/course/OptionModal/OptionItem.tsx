import type { ReactNode } from 'react';
import { textStyles } from '@/styles/tokens';

type Props = {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  selected: boolean;
  onClick: () => void;
};

function CheckMark() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="size-3 text-surface-white">
      <path
        d="M2.5 6.2L5 8.5L9.5 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function OptionItem({
  icon,
  title,
  description,
  selected,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-20 w-full items-center gap-3.5 rounded-[14px] border px-[18px] text-left transition-colors ${
        selected
          ? 'border-primary bg-primary-tint'
          : 'border-gray-200 bg-surface-white'
      }`}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gray-100">
        {icon}
      </span>
      <span className="flex flex-1 flex-col gap-1">
        <span className={`text-text-primary ${textStyles['body-medium-bold']}`}>
          {title}
        </span>
        {description && (
          <span className="text-[#737d8c] text-[11px] leading-4">
            {description}
          </span>
        )}
      </span>
      {selected && (
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary">
          <CheckMark />
        </span>
      )}
    </button>
  );
}
