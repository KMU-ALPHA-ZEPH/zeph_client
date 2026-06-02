import { textStyles } from '@/styles/tokens';
import TabSelector, { type TabItem } from '@/components/common/TabSelector';

export type PopularWayTab = 'walk' | 'safety' | 'general';

const DEFAULT_TABS: TabItem<PopularWayTab>[] = [
  { key: 'walk', label: '산책 코스' },
  { key: 'safety', label: '안전 코스' },
  { key: 'general', label: '운동 코스' },
];

type Props = {
  activeTab: PopularWayTab;
  onTabChange: (tab: PopularWayTab) => void;
  count: number;
  sortLabel?: string;
  onSortClick?: () => void;
  onFilterClick?: () => void;
  compact?: boolean;
};

export default function PopularWayCourseChoose({
  activeTab,
  onTabChange,
  count,
  sortLabel = '인기순',
  onSortClick,
  onFilterClick,
  compact = false,
}: Props) {
  return (
    <div className="sticky top-0 z-20 -mx-5 bg-surface-white">
      <div className="relative">
        <div className="relative z-10 bg-surface-white">
          <div className="px-5 pt-3">
            <TabSelector
              tabs={DEFAULT_TABS}
              activeKey={activeTab}
              onChange={onTabChange}
            />
          </div>
        </div>

        <div
          className={`absolute inset-x-0 top-full z-0 rounded-b-[10px] bg-surface-white shadow-[0_4px_8px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out ${
            compact
              ? 'pointer-events-none -translate-y-full opacity-0'
              : 'translate-y-0 opacity-100'
          }`}
        >
          <div className="flex flex-col gap-[13px] px-5 pb-[13px] pt-0">
            <div className="flex justify-end">
              <button
                type="button"
                aria-label="필터 열기"
                onClick={onFilterClick}
                className="grid min-w-11 place-items-end"
              >
                <span className="flex h-[18px] items-center gap-[3px] rounded-[5px] border-[0.6px] border-black px-[3px]">
                  <FilterIcon />
                  <span
                    className={`${textStyles['footnote']} text-text-primary`}
                  >
                    필터
                  </span>
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p>
                <span className="text-body-sm font-semibold text-text-primary">
                  코스{' '}
                </span>
                <span className="text-body-sm font-semibold text-text-secondary">
                  {count.toLocaleString()}
                </span>
              </p>
              <button
                type="button"
                onClick={onSortClick}
                className="flex items-center gap-1"
              >
                <span
                  className={`${textStyles['body-small']} font-medium text-text-primary`}
                >
                  {sortLabel}
                </span>
                <ChevronDownIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 2.5h9M3 6h6M4.5 9.5h3"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 8 8"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 3L4 5.5L6.5 3"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
