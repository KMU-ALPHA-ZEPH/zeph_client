import RouteIcon from '@/assets/icons/material-symbols-light_route.svg?react';
import BookmarkIcon from '@/assets/icons/circum_bookmark.svg?react';
import BookmarkFilledIcon from '@/assets/icons/circum_bookmark_filled.svg?react';
import FireIcon from '@/assets/icons/fluent_fire-20-filled.svg?react';
import BarChartIcon from '@/assets/icons/bar-chart.svg?react';

export type TabBarKey = 'create' | 'scrap' | 'popular' | 'stats';

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

const TABS: {
  key: TabBarKey;
  label: string;
  Icon: IconComponent;
  ActiveIcon?: IconComponent;
}[] = [
  { key: 'create', label: '코스 생성', Icon: RouteIcon },
  {
    key: 'scrap',
    label: '스크랩',
    Icon: BookmarkIcon,
    ActiveIcon: BookmarkFilledIcon,
  },
  { key: 'popular', label: '인기 경로', Icon: FireIcon },
  { key: 'stats', label: '통계', Icon: BarChartIcon },
];

type Props = {
  activeTab?: TabBarKey;
  onTabChange?: (tab: TabBarKey) => void;
  className?: string;
};

export default function TabBar({
  activeTab = 'popular',
  onTabChange,
  className = '',
}: Props) {
  return (
    <nav
      className={`flex h-[70px] w-full items-center justify-between bg-surface-white px-5 py-3 ${className}`}
    >
      {TABS.map(({ key, label, Icon, ActiveIcon }) => {
        const isActive = key === activeTab;
        const RenderedIcon = isActive && ActiveIcon ? ActiveIcon : Icon;
        return (
          <button
            key={key}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onTabChange?.(key)}
            className={`flex w-[43px] flex-col items-center gap-0.5 ${
              isActive ? 'text-text-primary' : 'text-gray-500'
            }`}
          >
            <span className="grid h-[25px] place-items-center">
              <RenderedIcon />
            </span>
            <span className="text-[9px] font-normal">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
