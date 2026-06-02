import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '@/pages/popular/CourseCard';
import PopularWayCourseChoose, {
  type PopularWayTab,
} from '@/pages/popular/PopularWayCourseChoose';
import TabBarLayout from '@/components/layout/TabBarLayout';
import AlignModal, {
  ALIGN_OPTIONS,
  type AlignKey,
} from '@/pages/popular/AlignModal';
import {
  getCourseDetail,
  getCourses,
  type CourseListItem,
} from '@/apis/courses';
import { useCourseStore } from '@/stores/courseStore';

/** 백엔드 type 문자열을 인기경로 탭과 매칭 */
const TYPE_TO_TAB: Record<string, PopularWayTab> = {
  walk: 'walk',
  safety: 'safety',
  exercise: 'general',
  workout: 'general',
};

const TYPE_TO_FORM: Record<string, 'workout' | 'walk' | 'safety' | null> = {
  walk: 'walk',
  safety: 'safety',
  exercise: 'workout',
  workout: 'workout',
};

/** "region" 문자열을 city/district 두 토막으로 쪼갠다 */
function splitRegion(region: string): { city: string; district: string } {
  if (!region) return { city: '', district: '' };
  const parts = region.split(/\s+/);
  return { city: parts[0] ?? '', district: parts.slice(1).join(' ') };
}

export default function PopularPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PopularWayTab>('walk');
  const [compact, setCompact] = useState(false);
  const [alignValue, setAlignValue] = useState<AlignKey>('popular');
  const [isAlignOpen, setIsAlignOpen] = useState(false);
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);
  const lastScrollY = useRef(0);

  const setResult = useCourseStore((s) => s.setResult);
  const setForm = useCourseStore((s) => s.setForm);
  const resetCourse = useCourseStore((s) => s.reset);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getCourses()
      .then((data) => setCourses(data))
      .catch((e) => {
        console.error('[PopularPage] getCourses failed:', e);
        setError('코스 목록을 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = useMemo(
    () => courses.filter((c) => TYPE_TO_TAB[c.type] === activeTab),
    [courses, activeTab],
  );

  const visibleCourses = useMemo(() => {
    const arr = [...filteredCourses];
    // CourseResponse 에 distanceKm 이 없어서 거리 정렬은 일단 인기순으로 fallback
    arr.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0));
    return arr;
  }, [filteredCourses, alignValue]);

  const handleOpenCourse = async (c: CourseListItem) => {
    if (navigating) return;
    setNavigating(true);
    try {
      const detail = await getCourseDetail(c.id);
      resetCourse();
      setForm({
        startName: c.name ?? '',
        startAddress: c.region ?? '',
        startLat: detail.startLat,
        startLng: detail.startLng,
        distanceKm: detail.distanceKm,
        courseType: TYPE_TO_FORM[detail.type ?? c.type] ?? null,
      });
      setResult({
        totalDistanceKm: detail.distanceKm,
        type: detail.type ?? c.type,
        startLat: detail.startLat,
        startLng: detail.startLng,
        pathData: detail.pathData,
        roundTrip: c.roundTrip,
      });
      navigate('/course/detail', {
        state: {
          courseId: c.id,
          initialName: c.name,
          initialDescription: c.description,
          editable: false,
        },
      });
    } catch (e) {
      console.error('[PopularPage] getCourseDetail failed:', e);
      alert('코스 정보를 불러오지 못했습니다.');
    } finally {
      setNavigating(false);
    }
  };

  const compactRef = useRef(false);
  compactRef.current = compact;
  const lastToggleAt = useRef(0);

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

      {loading ? (
        <p className="mt-[120px] self-center text-center text-body-sm text-gray-500">
          불러오는 중...
        </p>
      ) : error ? (
        <p className="mt-[120px] self-center text-center text-body-sm text-status-error">
          {error}
        </p>
      ) : visibleCourses.length === 0 ? (
        <p className="mt-[120px] self-center text-center text-body-sm text-gray-500">
          코스가 없습니다
        </p>
      ) : (
        <ul
          className={`flex flex-col gap-3 pb-[86px] transition-[margin-top] duration-300 ease-out ${
            compact ? 'mt-4' : 'mt-[100px]'
          }`}
        >
          {visibleCourses.map((c) => {
            const { city, district } = splitRegion(c.region);
            return (
              <li key={c.id}>
                <CourseCard
                  course={{
                    city,
                    district,
                    distance: 0,
                    description: c.description || c.name || '',
                    roundTrip: c.roundTrip,
                  }}
                  onClick={() => handleOpenCourse(c)}
                />
              </li>
            );
          })}
        </ul>
      )}

      <TabBarLayout activeTab="popular" />

      <AlignModal
        isOpen={isAlignOpen}
        onClose={() => setIsAlignOpen(false)}
        value={alignValue}
        onChange={setAlignValue}
      />
    </>
  );
}
