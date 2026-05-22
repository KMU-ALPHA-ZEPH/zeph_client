import { textStyles } from '@/styles/tokens';

export type TabItem<K extends string = string> = {
  key: K;
  label: string;
};

type Props<K extends string> = {
  tabs: TabItem<K>[];
  activeKey: K;
  onChange: (key: K) => void;
  className?: string;
};

export default function TabSelector<K extends string>({
  tabs,
  activeKey,
  onChange,
  className = '',
}: Props<K>) {
  return (
    <div role="tablist" className={`flex items-start gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className="flex min-h-9 flex-1 flex-col items-center justify-start gap-1"
          >
            <span
              className={`${textStyles['body-medium']} ${
                isActive ? 'text-text-primary' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </span>
            <span
              className={`h-[3px] w-full rounded-full ${
                isActive ? 'bg-primary' : 'bg-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
