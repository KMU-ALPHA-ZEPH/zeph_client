import { useEffect, useRef, useState } from 'react';
import CourseCard, { type Course } from '@/components/CourseCard';
import PopularWayHeader, {
  type PopularWayTab,
} from '@/components/PopularWayHeader';
import TabBar, { type TabBarKey } from '@/components/TabBar';
import AlignModal, {
  ALIGN_OPTIONS,
  type AlignKey,
} from '@/components/AlignModal';

const sampleCourses: Course[] = [
  {
    rank: 1,
    city: '서울시',
    district: '광진구 광장동',
    distance: 8,
    description: '벚꽃 길 특화 산책 코스~!',
    imageUrl: 'https://placehold.co/347x140',
    isBookmarked: false,
  },
  {
    rank: 1,
    city: '서울시',
    district: '광진구 광장동',
    distance: 8,
    description: '벚꽃 길 특화 산책 코스~!',
    imageUrl: 'https://placehold.co/347x140',
    isBookmarked: false,
  },
  {
    rank: 1,
    city: '서울시',
    district: '광진구 광장동',
    distance: 8,
    description: '벚꽃 길 특화 산책 코스~!',
    imageUrl: 'https://placehold.co/347x140',
    isBookmarked: false,
  },
  {
    rank: 1,
    city: '서울시',
    district: '광진구 광장동',
    distance: 8,
    description: '벚꽃 길 특화 산책 코스~!',
    imageUrl: 'https://placehold.co/347x140',
    isBookmarked: false,
  },
  {
    rank: 1,
    city: '서울시',
    district: '광진구 광장동',
    distance: 8,
    description: '벚꽃 길 특화 산책 코스~!',
    imageUrl: 'https://placehold.co/347x140',
    isBookmarked: false,
  },
  {
    rank: 1,
    city: '서울시',
    district: '광진구 광장동',
    distance: 8,
    description: '벚꽃 길 특화 산책 코스~!',
    imageUrl: 'https://placehold.co/347x140',
    isBookmarked: false,
  },
  {
    rank: 1,
    city: '서울시',
    district: '광진구 광장동',
    distance: 8,
    description: '벚꽃 길 특화 산책 코스~!',
    imageUrl: 'https://placehold.co/347x140',
    isBookmarked: false,
  },
  {
    rank: 1,
    city: '서울시',
    district: '광진구 광장동',
    distance: 8,
    description: '벚꽃 길 특화 산책 코스~!',
    imageUrl: 'https://placehold.co/347x140',
    isBookmarked: false,
  },
  {
    rank: 2,
    city: '서울시',
    district: '성동구 성수동',
    distance: 5,
    description: '한강뷰 러닝 코스',
    imageUrl: 'https://placehold.co/347x140/cccccc/333333',
    isBookmarked: true,
  },
  {
    rank: 3,
    city: '서울시',
    district: '용산구 이태원동',
    distance: 12,
    description: '도심 야경 산책',
    isBookmarked: false,
  },
];

export default function CourseCardPreviewPage() {
  const [activeTab, setActiveTab] = useState<PopularWayTab>('walk');
  const [activeBottomTab, setActiveBottomTab] = useState<TabBarKey>('popular');
  const [compact, setCompact] = useState(false);
  const [alignValue, setAlignValue] = useState<AlignKey>('popular');
  const [isAlignOpen, setIsAlignOpen] = useState(false);
  const lastScrollY = useRef(0);
  const compactRef = useRef(false);
  const lastToggleAt = useRef(0);

  compactRef.current = compact;

  const alignLabel =
    ALIGN_OPTIONS.find((o) => o.key === alignValue)?.label ?? '인기순';

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const now = Date.now();
        const y = window.scrollY;
        const delta = y - lastScrollY.current;
        const threshold = 30;
        const minDelta = 8;
        const lockMs = 350;

        let next: boolean | null = null;
        if (y < threshold) next = false;
        else if (delta > minDelta) next = true;
        else if (delta < -minDelta) next = false;

        if (next !== null) {
          if (
            next !== compactRef.current &&
            now - lastToggleAt.current >= lockMs
          ) {
            setCompact(next);
            lastToggleAt.current = now;
          }
          lastScrollY.current = y;
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <PopularWayHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        count={sampleCourses.length}
        sortLabel={alignLabel}
        onSearchClick={() => {}}
        onFilterClick={() => {}}
        onSortClick={() => setIsAlignOpen(true)}
        compact={compact}
      />

      <ul
        className={`flex flex-col gap-3 pb-[86px] transition-[margin-top] duration-300 ease-out ${
          compact ? 'mt-4' : 'mt-[100px]'
        }`}
      >
        {sampleCourses.map((course, idx) => (
          <li key={`${course.rank}-${idx}`}>
            <CourseCard course={course} />
          </li>
        ))}
      </ul>

      <div className="fixed inset-x-0 bottom-0 z-10">
        <div className="mx-auto w-full max-w-[390px]">
          <div className="pointer-events-none h-4 bg-gradient-to-t from-surface-white to-transparent" />
          <TabBar
            activeTab={activeBottomTab}
            onTabChange={setActiveBottomTab}
          />
        </div>
      </div>

      <AlignModal
        isOpen={isAlignOpen}
        onClose={() => setIsAlignOpen(false)}
        value={alignValue}
        onChange={setAlignValue}
      />
    </>
  );
}
