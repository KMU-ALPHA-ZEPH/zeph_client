import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TabBarLayout from '@/components/layout/TabBarLayout';
import ScrapCard from '@/pages/scrap/ScrapCard';
import EditCategoryModal from '@/pages/scrap/EditCategoryModal';
import { addGroup, getGroups, type GroupResponse } from '@/apis/groups';
import { getScraps, type ScrapPreviewResponse } from '@/apis/scraps';
import { getCourseDetail, getCourses } from '@/apis/courses';
import { LIKED_GROUP_NAME } from '@/apis/likes';
import { readPinned } from '@/pages/scrap/pinned';
import { useCourseStore } from '@/stores/courseStore';

const TYPE_TO_FORM: Record<string, 'workout' | 'walk' | 'safety' | null> = {
  walk: 'walk',
  safety: 'safety',
  exercise: 'workout',
  workout: 'workout',
};

export default function ScrapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [searchResults, setSearchResults] = useState<ScrapPreviewResponse[]>(
    [],
  );
  const [searching, setSearching] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const [pinnedIds, setPinnedIds] = useState<number[]>(() => readPinned());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const setResult = useCourseStore((s) => s.setResult);
  const setForm = useCourseStore((s) => s.setForm);
  const resetCourse = useCourseStore((s) => s.reset);

  const loadGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const [groupData, likedCourses] = await Promise.all([
        getGroups(),
        getCourses({ liked: true }).catch(() => []),
      ]);
      // 별도 하트 카드로 노출하므로 동일 이름의 잔여 그룹은 일반 목록에서 제외
      const visible = groupData.filter((g) => g.name !== LIKED_GROUP_NAME);
      setGroups(visible);
      setLikedCount(likedCourses.length);
    } catch {
      setError('스크랩 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
    setPinnedIds(readPinned());
  }, [location.key]);

  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id) ? 1 : 0;
      const bPinned = pinnedIds.includes(b.id) ? 1 : 0;
      return bPinned - aPinned;
    });
  }, [groups, pinnedIds]);

  // 검색 안 함: 카테고리 카드 목록 그대로
  const filteredGroups = useMemo(() => {
    if (search.trim()) return [];
    return sortedGroups;
  }, [search, sortedGroups]);

  // 검색 함: 백엔드 /v0/scraps?keyword 로 내 스크랩만 직접 받는다.
  useEffect(() => {
    const q = search.trim();
    if (!q) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const timer = setTimeout(() => {
      getScraps({ keyword: q })
        .then((data) => {
          if (!cancelled) setSearchResults(data);
        })
        .catch(() => {
          if (!cancelled) setSearchResults([]);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  const totalCount = search.trim()
    ? searchResults.length
    : filteredGroups.length;

  const handleOpenCourse = async (scrap: ScrapPreviewResponse) => {
    if (navigating) return;
    setNavigating(true);
    try {
      const detail = await getCourseDetail(scrap.courseId);
      resetCourse();
      setForm({
        startName: scrap.name,
        startAddress: scrap.region ?? '',
        startLat: detail.startLat,
        startLng: detail.startLng,
        distanceKm: detail.distanceKm,
        courseType: TYPE_TO_FORM[detail.type ?? scrap.type] ?? null,
      });
      setResult({
        totalDistanceKm: detail.distanceKm,
        type: detail.type ?? scrap.type,
        startLat: detail.startLat,
        startLng: detail.startLng,
        pathData: detail.pathData,
      });
      navigate('/course/detail', {
        state: {
          scrapId: scrap.scrapId,
          courseId: scrap.courseId,
          initialName: scrap.name,
          initialDescription: scrap.description,
        },
      });
    } catch {
      alert('코스 정보를 불러오지 못했습니다.');
    } finally {
      setNavigating(false);
    }
  };

  const handleAddGroup = async ({
    name,
    description,
  }: {
    name: string;
    description?: string;
  }) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await addGroup({ name, description: description || undefined });
      await loadGroups();
    } catch {
      alert('카테고리 추가에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex h-9 w-full items-center gap-1 overflow-hidden rounded-[15px] bg-gray-300/70 px-[22px] py-1">
        <SearchIcon />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="스크랩한 러닝 코스를 찾아보세요"
          className="flex-1 bg-transparent text-body-md font-normal text-text-primary outline-none placeholder:text-text-primary/80"
        />
      </div>

      <div className="my-2 h-px bg-gray-400" />

      <p className="self-start text-body-sm text-primary">
        전체 {totalCount}개
      </p>

      {loading ? (
        <p className="self-center py-10 text-body-sm text-gray-500">
          불러오는 중...
        </p>
      ) : error ? (
        <p className="self-center py-10 text-body-sm text-status-error">
          {error}
        </p>
      ) : search.trim() && searching && searchResults.length === 0 ? (
        <p className="self-center py-10 text-body-sm text-gray-500">
          검색 중...
        </p>
      ) : totalCount === 0 ? (
        <p className="self-center py-10 text-body-sm text-gray-500">
          {search.trim()
            ? '검색 결과가 없습니다'
            : '스크랩한 카테고리가 없습니다'}
        </p>
      ) : search.trim() ? (
        // 검색 모드 — 백엔드 /v0/scraps?keyword 결과
        <ul className="flex flex-col gap-3 pb-[110px]">
          {searchResults.map((s) => (
            <li key={s.scrapId}>
              <ScrapCard
                data={{
                  id: String(s.scrapId),
                  title: s.name,
                  description: s.region,
                }}
                onClick={() => handleOpenCourse(s)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col gap-3 pb-[110px]">
          <li>
            <ScrapCard
              data={{
                id: 'liked',
                title: '좋아요 표시한 코스',
                count: likedCount,
                iconType: 'heart',
              }}
              onClick={() => navigate('/liked')}
            />
          </li>
          {filteredGroups.map((group) => (
            <li key={group.id}>
              <ScrapCard
                data={{
                  id: String(group.id),
                  title: group.name,
                  count: group.courseCount,
                  imageUrl: group.imageUrl,
                  isPinned: pinnedIds.includes(group.id),
                }}
                onClick={() =>
                  navigate(`/scrap/${group.id}`, {
                    state: {
                      title: group.name,
                      description: group.description,
                      imageUrl: group.imageUrl,
                    },
                  })
                }
              />
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        aria-label="새 스크랩 폴더"
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-[98px] right-[calc(50%-175px+10px)] z-20 grid size-[52px] place-items-center rounded-full bg-primary text-white shadow-base transition-transform active:scale-95"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 4v12M4 10h12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <TabBarLayout activeTab="scrap" />

      <EditCategoryModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="카테고리 추가"
        onSubmit={({ name, description }) =>
          handleAddGroup({ name, description })
        }
      />
    </div>
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
