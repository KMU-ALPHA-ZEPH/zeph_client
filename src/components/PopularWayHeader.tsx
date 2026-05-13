import { AnimatePresence, motion } from 'framer-motion';
import { textStyles } from '@/styles/tokens';
import SearchBar from '@/components/SearchBar';

export type PopularWayTab = 'walk' | 'safety' | 'general';

const TABS: { key: PopularWayTab; label: string }[] = [
  { key: 'walk', label: '산책 코스' },
  { key: 'safety', label: '안전 코스' },
  { key: 'general', label: '일반 코스' },
];

type Props = {
  activeTab: PopularWayTab;
  onTabChange: (tab: PopularWayTab) => void;
  count: number;
  title?: string;
  sortLabel?: string;
  onSortClick?: () => void;
  onFilterClick?: () => void;
  onSearchClick?: () => void;
  compact?: boolean;
  searchOpen?: boolean;
  searchValue?: string;
  onSearchValueChange?: (v: string) => void;
  onSearchClose?: () => void;
};

export default function PopularWayHeader({
  activeTab,
  onTabChange,
  count,
  title = '인기 코스',
  sortLabel = '인기순',
  onSortClick,
  onFilterClick,
  onSearchClick,
  compact = false,
  searchOpen = false,
  searchValue = '',
  onSearchValueChange,
  onSearchClose,
}: Props) {
  return (
    <div className="sticky top-0 z-20 -mx-5 bg-surface-white">
      <div className="relative">
        <div className="relative z-10 bg-surface-white">
          <div className="flex items-center justify-between px-5 pt-[14.5px]">
            <h1 className="text-number-md font-bold text-text-primary">
              {title}
            </h1>
            <motion.div
              initial={false}
              animate={{ width: searchOpen ? 260 : 44 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="-mr-3 flex h-11 items-center justify-end overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {searchOpen ? (
                  <motion.div
                    key="searchbar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: 0.1 }}
                    className="w-full"
                  >
                    <SearchBar
                      value={searchValue}
                      onChange={onSearchValueChange ?? (() => {})}
                      autoFocus
                      onClose={onSearchClose}
                    />
                  </motion.div>
                ) : (
                  <motion.button
                    key="searchbtn"
                    type="button"
                    aria-label="검색"
                    onClick={onSearchClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: 0.1 }}
                    className="grid h-11 w-11 place-items-center"
                  >
                    <SearchIcon />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="mt-[13px] px-5">
            <div role="tablist" className="flex items-start gap-2">
              {TABS.map((tab) => {
                const isActive = tab.key === activeTab;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => onTabChange(tab.key)}
                    className="flex min-h-11 w-[112px] flex-col items-center justify-start gap-1"
                  >
                    <span
                      className={`${textStyles['body-large']} text-text-primary`}
                    >
                      {tab.label}
                    </span>
                    <span
                      className={`h-[3px] w-[110px] rounded-full ${
                        isActive ? 'bg-primary' : 'bg-transparent'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={`absolute inset-x-0 top-full z-0 rounded-b-[10px] bg-surface-white shadow-[0_4px_8px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out ${
            compact
              ? 'pointer-events-none -translate-y-full opacity-0'
              : 'translate-y-0 opacity-100'
          }`}
        >
          <div className="flex flex-col gap-[13px] px-5 py-[13px]">
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
                <span className="text-body-md font-semibold text-text-primary">
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

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.25" stroke="#0F172A" strokeWidth="1.5" />
      <path
        d="M12.5 12.5L17 17"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
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
