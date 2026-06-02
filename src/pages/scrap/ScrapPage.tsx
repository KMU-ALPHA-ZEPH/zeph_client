import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TabBarLayout from '@/components/layout/TabBarLayout';
import ScrapCard from '@/pages/scrap/ScrapCard';
import EditCategoryModal from '@/pages/scrap/EditCategoryModal';
import { addGroup, getGroups, type GroupResponse } from '@/apis/groups';
import { getScrapsByGroup, type ScrapPreviewResponse } from '@/apis/scraps';
import { getCourses } from '@/apis/courses';
import { LIKED_GROUP_NAME } from '@/apis/likes';
import { readPinned } from '@/pages/scrap/pinned';

export default function ScrapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [scrapsByGroup, setScrapsByGroup] = useState<
    Record<number, ScrapPreviewResponse[]>
  >({});
  const [likedCount, setLikedCount] = useState(0);
  const [pinnedIds, setPinnedIds] = useState<number[]>(() => readPinned());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      const lists = await Promise.all(
        visible.map((g) => getScrapsByGroup(g.id).catch(() => [])),
      );
      const map: Record<number, ScrapPreviewResponse[]> = {};
      visible.forEach((g, i) => {
        map[g.id] = lists[i];
      });
      setScrapsByGroup(map);
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

  const filtered = useMemo(() => {
    if (!search.trim()) return sortedGroups;
    const q = search.toLowerCase();
    return sortedGroups.filter((g) => {
      const list = scrapsByGroup[g.id] ?? [];
      return list.some(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.type?.toLowerCase().includes(q),
      );
    });
  }, [search, sortedGroups, scrapsByGroup]);

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
        전체 {filtered.length}개
      </p>

      {loading ? (
        <p className="self-center py-10 text-body-sm text-gray-500">
          불러오는 중...
        </p>
      ) : error ? (
        <p className="self-center py-10 text-body-sm text-status-error">
          {error}
        </p>
      ) : filtered.length === 0 ? (
        <p className="self-center py-10 text-body-sm text-gray-500">
          {search.trim()
            ? '검색 결과가 없습니다'
            : '스크랩한 카테고리가 없습니다'}
        </p>
      ) : (
        <ul className="flex flex-col gap-3 pb-[110px]">
          {!search.trim() && (
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
          )}
          {filtered.map((group) => (
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
