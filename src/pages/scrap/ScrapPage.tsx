import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TabBarLayout from '@/components/layout/TabBarLayout';
import ScrapCard, { type ScrapCardData } from '@/pages/scrap/ScrapCard';
import EditCategoryModal from '@/pages/scrap/EditCategoryModal';
import { readPinned } from '@/pages/scrap/pinned';
import { readOverrides, type ScrapOverride } from '@/pages/scrap/overrides';
import { SCRAP_CATEGORIES, type ScrapCategory } from '@/pages/scrap/data';
import { readSavedCourses } from '@/pages/scrap/savedCourses';

type ScrapListItem = ScrapCardData & { courses: ScrapCategory['courses'] };

const INITIAL_CATEGORIES: ScrapListItem[] = SCRAP_CATEGORIES.map((c) => ({
  id: c.id,
  title: c.title,
  description: c.description,
  imageUrl: c.imageUrl,
  iconType: c.iconType,
  count: c.iconType === 'heart' ? undefined : c.courses.length,
  courses: c.courses,
}));

export default function ScrapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [categories, setCategories] =
    useState<ScrapListItem[]>(INITIAL_CATEGORIES);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => readPinned());
  const [overrides, setOverrides] = useState<Record<string, ScrapOverride>>(
    () => readOverrides(),
  );
  const [saved, setSaved] = useState(() => readSavedCourses());

  useEffect(() => {
    setPinnedIds(readPinned());
    setOverrides(readOverrides());
    setSaved(readSavedCourses());
  }, [location.key]);

  const sorted = useMemo(() => {
    const withPin = categories.map((c) => {
      const o = overrides[c.id];
      const extra = saved[c.id]?.length ?? 0;
      return {
        ...c,
        title: o?.title ?? c.title,
        description: o?.description ?? c.description,
        imageUrl: o?.imageUrl ?? c.imageUrl,
        count: c.count != null ? c.count + extra : c.count,
        isPinned: pinnedIds.includes(c.id),
      };
    });
    return [...withPin].sort((a, b) => {
      const aTop = a.iconType === 'heart' ? 2 : a.isPinned ? 1 : 0;
      const bTop = b.iconType === 'heart' ? 2 : b.isPinned ? 1 : 0;
      return bTop - aTop;
    });
  }, [categories, pinnedIds, overrides, saved]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter((c) =>
      c.courses.some((course) => course.name.toLowerCase().includes(q)),
    );
  }, [search, sorted]);

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

      <ul className="flex flex-col gap-3 pb-[110px]">
        {filtered.map((cat) => (
          <li key={cat.id}>
            <ScrapCard
              data={cat}
              onClick={() =>
                navigate(`/scrap/${cat.id}`, {
                  state: {
                    title: cat.title,
                    description: cat.description,
                    imageUrl: cat.imageUrl,
                    iconType: cat.iconType,
                  },
                })
              }
            />
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-label="새 스크랩 폴더"
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-[90px] right-[calc(50%-175px+10px)] z-20 grid size-[52px] place-items-center rounded-full bg-primary text-white shadow-base transition-transform active:scale-95"
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
        onSubmit={({ name, description, imageUrl }) => {
          setCategories((prev) => [
            ...prev,
            {
              id: `cat-${Date.now()}`,
              title: name,
              count: 0,
              description: description || undefined,
              imageUrl,
              courses: [],
            },
          ]);
        }}
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
