import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  type GetCoursesParams,
} from '@/apis/courses';
import { readFilter, type FilterValue } from '@/pages/popular/FilterPage';
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

const ALIGN_TO_SORT: Record<AlignKey, NonNullable<GetCoursesParams['sort']>> = {
  popular: 'POPULAR',
  nearest: 'NEAREST',
  'distance-asc': 'DISTANCE_ASC',
  'distance-desc': 'DISTANCE_DESC',
};

/** 가까운순에 사용할 사용자 현재 좌표를 한 번 받아온다. */
function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      reject,
      { timeout: 5000 },
    );
  });
}

export default function PopularPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<PopularWayTab>('walk');
  const [compact, setCompact] = useState(false);
  const [alignValue, setAlignValue] = useState<AlignKey>('popular');
  const [isAlignOpen, setIsAlignOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [filter, setFilter] = useState<FilterValue>(() => readFilter());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);
  const lastScrollY = useRef(0);

  // FilterPage 에서 돌아왔을 때 localStorage 의 최신 값을 다시 읽는다.
  useEffect(() => {
    setFilter(readFilter());
  }, [location.key]);

  // 검색 디바운스 — 250ms 후 실제 API 파라미터로 반영
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const setResult = useCourseStore((s) => s.setResult);
  const setForm = useCourseStore((s) => s.setForm);
  const resetCourse = useCourseStore((s) => s.reset);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: GetCoursesParams = { sort: ALIGN_TO_SORT[alignValue] };

        // 지역이 선택돼 있으면 그 좌표를 중심으로 반경 필터. 가까운순도 이 좌표 기준.
        if (filter.region) {
          params.lat = filter.region.lat;
          params.lng = filter.region.lng;
          params.radiusKm = filter.radius;
        } else if (alignValue === 'nearest') {
          try {
            const pos = await getCurrentPosition();
            params.lat = pos.lat;
            params.lng = pos.lng;
          } catch {
            // 위치 권한 거부/실패 시 인기순으로 폴백
            params.sort = 'POPULAR';
          }
        }

        if (filter.minDistance > 0) params.minDistanceKm = filter.minDistance;
        if (filter.maxDistance > 0) params.maxDistanceKm = filter.maxDistance;
        if (debouncedSearch.trim()) params.keyword = debouncedSearch.trim();

        const data = await getCourses(params);
        if (!cancelled) setCourses(data);
      } catch (e) {
        if (!cancelled) {
          console.error('[PopularPage] getCourses failed:', e);
          setError('코스 목록을 불러오지 못했습니다.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [
    alignValue,
    filter.region?.lat,
    filter.region?.lng,
    filter.radius,
    filter.minDistance,
    filter.maxDistance,
    debouncedSearch,
  ]);

  // 정렬·반경·거리 필터는 백엔드가 처리하고, 왕복 토글과 탭 필터만 클라이언트에서 적용한다.
  const visibleCourses = useMemo(
    () =>
      courses
        .filter((c) => TYPE_TO_TAB[c.type] === activeTab)
        .filter((c) => !filter.roundTrip || c.roundTrip === true),
    [courses, activeTab, filter.roundTrip],
  );

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
          scrapId: detail.scrapId ?? c.scrapId ?? undefined,
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
      <div className="flex h-9 w-full items-center gap-1 overflow-hidden rounded-[15px] bg-gray-300/70 px-[22px] py-1">
        <SearchIcon />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="코스 이름이나 지역으로 검색"
          className="flex-1 bg-transparent text-body-md font-normal text-text-primary outline-none placeholder:text-text-primary/80"
        />
      </div>

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
          {visibleCourses.map((c) => (
            <li key={c.id}>
              <CourseCard
                course={{
                  name: c.name,
                  distance: c.distanceKm ?? 0,
                  description: c.description || '',
                  coursePath: c.coursePath,
                  roundTrip: c.roundTrip,
                }}
                onClick={() => handleOpenCourse(c)}
              />
            </li>
          ))}
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

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="5" stroke="#8D8D8D" strokeWidth="1.5" />
      <path
        d="M11 11L14.5 14.5"
        stroke="#8D8D8D"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
