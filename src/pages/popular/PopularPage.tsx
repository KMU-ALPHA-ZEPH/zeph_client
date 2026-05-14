import { useEffect, useRef, useState } from 'react';
import CourseCard, { type Course } from '@/pages/popular/CourseCard';
import PopularWayCourseChoose, {
  type PopularWayTab,
} from '@/components/common/Header/PopularWayCourseChoose';
import TabBar, { type TabBarKey } from '@/components/common/TabBar';
import AlignModal, {
  ALIGN_OPTIONS,
  type AlignKey,
} from '@/pages/popular/AlignModal';
import BookmarkToast from '@/components/BookmarkToast';

type SampleCourse = Course & { id: string; tab: PopularWayTab };

const initialCourses: SampleCourse[] = [
  // 산책 코스
  {
    id: 'w1',
    tab: 'walk',
    rank: 1,
    city: '서울시',
    district: '광진구 광장동',
    distance: 8,
    description: '벚꽃 길 특화 산책 코스~!',
    imageUrl: 'https://placehold.co/48x48',
    isBookmarked: false,
  },
  {
    id: 'w2',
    tab: 'walk',
    rank: 2,
    city: '서울시',
    district: '성동구 성수동',
    distance: 5,
    description: '한강뷰 산책 코스',
    imageUrl: 'https://placehold.co/48x48/eeeeee/333333',
    isBookmarked: false,
  },
  {
    id: 'w3',
    tab: 'walk',
    rank: 3,
    city: '서울시',
    district: '용산구 이태원동',
    distance: 3,
    description: '도심 야경 산책',
    imageUrl: 'https://placehold.co/48x48/cccccc/333333',
    isBookmarked: false,
  },
  {
    id: 'w4',
    tab: 'walk',
    rank: 4,
    city: '서울시',
    district: '종로구 부암동',
    distance: 6,
    description: '북악산 자락길 산책',
    imageUrl: 'https://placehold.co/48x48/dddddd/444444',
    isBookmarked: false,
  },
  {
    id: 'w5',
    tab: 'walk',
    rank: 5,
    city: '서울시',
    district: '강서구 마곡동',
    distance: 4,
    description: '서울식물원 둘레 산책',
    imageUrl: 'https://placehold.co/48x48/c0e0c0',
    isBookmarked: false,
  },
  // 안전 코스
  {
    id: 's1',
    tab: 'safety',
    rank: 1,
    city: '서울시',
    district: '서대문구 신촌동',
    distance: 4,
    description: 'CCTV·가로등 많은 안심 코스',
    imageUrl: 'https://placehold.co/48x48/ddddee',
    isBookmarked: false,
  },
  {
    id: 's2',
    tab: 'safety',
    rank: 2,
    city: '서울시',
    district: '마포구 합정동',
    distance: 6,
    description: '경찰서 인근 안심 코스',
    imageUrl: 'https://placehold.co/48x48/ccccdd',
    isBookmarked: false,
  },
  {
    id: 's3',
    tab: 'safety',
    rank: 3,
    city: '서울시',
    district: '동작구 흑석동',
    distance: 3,
    description: '인적 많은 한강대교 야간 코스',
    imageUrl: 'https://placehold.co/48x48/bbbbcc',
    isBookmarked: false,
  },
  // 일반 코스
  {
    id: 'g1',
    tab: 'general',
    rank: 1,
    city: '서울시',
    district: '강남구 신사동',
    distance: 7,
    description: '가로수길 도심 코스',
    imageUrl: 'https://placehold.co/48x48/f0d0a0',
    isBookmarked: false,
  },
  {
    id: 'g2',
    tab: 'general',
    rank: 2,
    city: '서울시',
    district: '송파구 잠실동',
    distance: 10,
    description: '석촌호수 둘레 코스',
    imageUrl: 'https://placehold.co/48x48/a0d0f0',
    isBookmarked: false,
  },
  {
    id: 'g3',
    tab: 'general',
    rank: 3,
    city: '서울시',
    district: '영등포구 여의도동',
    distance: 9,
    description: '여의도 한강공원 일주',
    imageUrl: 'https://placehold.co/48x48/d0e0f0',
    isBookmarked: false,
  },
  {
    id: 'g4',
    tab: 'general',
    rank: 4,
    city: '서울시',
    district: '중구 명동',
    distance: 4,
    description: '명동 도심 산책 코스',
    imageUrl: 'https://placehold.co/48x48/f0c0c0',
    isBookmarked: false,
  },
];

export default function PopularPage() {
  const [activeTab, setActiveTab] = useState<PopularWayTab>('walk');
  const [activeBottomTab, setActiveBottomTab] = useState<TabBarKey>('popular');
  const [compact, setCompact] = useState(false);
  const [alignValue, setAlignValue] = useState<AlignKey>('popular');
  const [isAlignOpen, setIsAlignOpen] = useState(false);
  const [courses, setCourses] = useState(initialCourses);
  const [toastId, setToastId] = useState<string | null>(null);
  const lastScrollY = useRef(0);

  const visibleCourses = courses.filter((c) => c.tab === activeTab);

  const toggleBookmark = (id: string) => {
    const target = courses.find((c) => c.id === id);
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c,
      ),
    );
    if (target && !target.isBookmarked) setToastId(id);
  };
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
      <PopularWayCourseChoose
        activeTab={activeTab}
        onTabChange={setActiveTab}
        count={visibleCourses.length}
        sortLabel={alignLabel}
        onFilterClick={() => {}}
        onSortClick={() => setIsAlignOpen(true)}
        compact={compact}
      />

      <ul
        className={`flex flex-col gap-3 pb-[86px] transition-[margin-top] duration-300 ease-out ${
          compact ? 'mt-4' : 'mt-[100px]'
        }`}
      >
        {visibleCourses.map((course) => (
          <li key={course.id}>
            <CourseCard
              course={course}
              onBookmarkToggle={() => toggleBookmark(course.id)}
            />
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

      <BookmarkToast
        isOpen={toastId !== null}
        onClose={() => setToastId(null)}
        onAction={() => {
          if (toastId !== null) toggleBookmark(toastId);
          setToastId(null);
        }}
      />
    </>
  );
}
