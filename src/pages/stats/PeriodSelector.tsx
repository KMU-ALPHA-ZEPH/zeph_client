export type Period = 'week' | 'month' | 'year' | 'all';

const OPTIONS: { key: Period; label: string }[] = [
  { key: 'week', label: '주' },
  { key: 'month', label: '월' },
  { key: 'year', label: '년' },
  { key: 'all', label: '전체' },
];

type Props = {
  value: Period;
  onChange: (value: Period) => void;
  className?: string;
};

export default function PeriodSelector({
  value,
  onChange,
  className = '',
}: Props) {
  return (
    <div
      role="radiogroup"
      className={`flex h-[21px] w-full items-stretch rounded-[10px] border-[0.4px] border-gray-400 ${className}`}
    >
      {OPTIONS.map((opt) => {
        const isActive = opt.key === value;
        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.key)}
            className={`flex flex-1 items-center justify-center rounded-[10px] text-[12px] transition-colors ${
              isActive
                ? 'bg-primary font-medium text-white'
                : 'font-normal text-text-secondary'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
