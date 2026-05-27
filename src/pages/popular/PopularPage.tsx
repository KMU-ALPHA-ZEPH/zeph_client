import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard, { type Course } from '@/pages/popular/CourseCard';
import PopularWayCourseChoose, {
  type PopularWayTab,
} from '@/pages/popular/PopularWayCourseChoose';
import TabBarLayout from '@/components/layout/TabBarLayout';
import AlignModal, {
  ALIGN_OPTIONS,
  type AlignKey,
} from '@/pages/popular/AlignModal';
import { useSaveToScrap, todayString } from '@/hooks/useSaveToScrap';
import { readFilter, readUserLocation } from '@/pages/popular/FilterPage';

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
    isBookmarked: false,
    lat: 37.5469,
    lng: 127.1086,
    roundTrip: true,
  },
  {
    id: 'w2',
    tab: 'walk',
    rank: 2,
    city: '서울시',
    district: '성동구 성수동',
    distance: 5,
    description: '한강뷰 산책 코스',
    isBookmarked: false,
    lat: 37.5446,
    lng: 127.0563,
    roundTrip: true,
  },
  {
    id: 'w3',
    tab: 'walk',
    rank: 3,
    city: '서울시',
    district: '용산구 이태원동',
    distance: 3,
    description: '도심 야경 산책',
    isBookmarked: false,
    lat: 37.5345,
    lng: 126.9947,
  },
  {
    id: 'w4',
    tab: 'walk',
    rank: 4,
    city: '서울시',
    district: '종로구 부암동',
    distance: 6,
    description: '북악산 자락길 산책',
    isBookmarked: false,
    lat: 37.5921,
    lng: 126.9633,
  },
  {
    id: 'w5',
    tab: 'walk',
    rank: 5,
    city: '서울시',
    district: '강서구 마곡동',
    distance: 4,
    description: '서울식물원 둘레 산책',
    isBookmarked: false,
    lat: 37.5594,
    lng: 126.8252,
    roundTrip: true,
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
    isBookmarked: false,
    lat: 37.5556,
    lng: 126.9377,
  },
  {
    id: 's2',
    tab: 'safety',
    rank: 2,
    city: '서울시',
    district: '마포구 합정동',
    distance: 6,
    description: '경찰서 인근 안심 코스',
    isBookmarked: false,
    lat: 37.5495,
    lng: 126.9134,
    roundTrip: true,
  },
  {
    id: 's3',
    tab: 'safety',
    rank: 3,
    city: '서울시',
    district: '동작구 흑석동',
    distance: 3,
    description: '인적 많은 한강대교 야간 코스',
    isBookmarked: false,
    lat: 37.5071,
    lng: 126.9603,
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
    isBookmarked: false,
    lat: 37.521,
    lng: 127.0214,
  },
  {
    id: 'g2',
    tab: 'general',
    rank: 2,
    city: '서울시',
    district: '송파구 잠실동',
    distance: 10,
    description: '석촌호수 둘레 코스',
    isBookmarked: false,
    lat: 37.5133,
    lng: 127.1027,
    roundTrip: true,
  },
  {
    id: 'g3',
    tab: 'general',
    rank: 3,
    city: '서울시',
    district: '영등포구 여의도동',
    distance: 9,
    description: '여의도 한강공원 일주',
    isBookmarked: false,
    lat: 37.5235,
    lng: 126.9277,
  },
  {
    id: 'g4',
    tab: 'general',
    rank: 4,
    city: '서울시',
    district: '중구 명동',
    distance: 4,
    description: '명동 도심 산책 코스',
    isBookmarked: false,
    lat: 37.5634,
    lng: 126.9858,
  },
];

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function PopularPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PopularWayTab>('walk');
  const [compact, setCompact] = useState(false);
  const [alignValue, setAlignValue] = useState<AlignKey>('popular');
  const [isAlignOpen, setIsAlignOpen] = useState(false);
  const [courses, setCourses] = useState(initialCourses);
  const { requestSave, saveToScrapElement } = useSaveToScrap(
    (_cat, _title, course) =>
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, isBookmarked: true } : c,
        ),
      ),
  );
  const [filter, setFilter] = useState(() => readFilter());
  const lastScrollY = useRef(0);

  useEffect(() => {
    setFilter(readFilter());
  }, []);

  const userLocation = readUserLocation();

  const filteredCourses = courses
    .filter((c) => c.tab === activeTab)
    .filter((c) => {
      if (c.distance < filter.minDistance) return false;
      if (filter.maxDistance > 0 && c.distance > filter.maxDistance)
        return false;
      if (filter.region && c.lat != null && c.lng != null) {
        const dist = haversineKm(
          filter.region.lat,
          filter.region.lng,
          c.lat,
          c.lng,
        );
        if (dist > filter.radius) return false;
      }
      if (filter.roundTrip && !c.roundTrip) return false;
      return true;
    });

  const visibleCourses = [...filteredCourses].sort((a, b) => {
    if (alignValue === 'distance-asc') return a.distance - b.distance;
    if (alignValue === 'distance-desc') return b.distance - a.distance;
    if (
      alignValue === 'nearest' &&
      userLocation &&
      a.lat != null &&
      a.lng != null &&
      b.lat != null &&
      b.lng != null
    ) {
      const da = haversineKm(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const db = haversineKm(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return da - db;
    }
    return (a.rank ?? 0) - (b.rank ?? 0);
  });

  const handleBookmarkClick = (id: string) => {
    const target = courses.find((c) => c.id === id);
    if (!target) return;
    if (target.isBookmarked) {
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isBookmarked: false } : c)),
      );
      return;
    }
    requestSave({
      id: target.id,
      name: target.description,
      date: todayString(),
      region: `${target.city}\n${target.district}`,
      imageUrl: target.imageUrl,
    });
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
        onFilterClick={() => navigate('/filter')}
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
              onBookmarkToggle={() => handleBookmarkClick(course.id)}
            />
          </li>
        ))}
      </ul>

      <TabBarLayout activeTab="popular" />

      <AlignModal
        isOpen={isAlignOpen}
        onClose={() => setIsAlignOpen(false)}
        value={alignValue}
        onChange={setAlignValue}
      />

      {saveToScrapElement}
    </>
  );
}
