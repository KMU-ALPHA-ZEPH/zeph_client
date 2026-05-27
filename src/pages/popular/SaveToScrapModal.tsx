import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import ScrapCard from '@/pages/scrap/ScrapCard';
import { readOverrides } from '@/pages/scrap/overrides';
import { readPinned } from '@/pages/scrap/pinned';
import { readSavedCourses } from '@/pages/scrap/savedCourses';
import { SCRAP_CATEGORIES } from '@/pages/scrap/data';

const CATEGORIES = SCRAP_CATEGORIES.map((c) => ({
  id: c.id,
  title: c.title,
  description: c.description,
  imageUrl: c.imageUrl,
  iconType: c.iconType,
  count: c.iconType === 'heart' ? undefined : c.courses.length,
  courses: c.courses,
}));

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (categoryId: string, categoryTitle: string) => void;
};

export default function SaveToScrapModal({ isOpen, onClose, onSelect }: Props) {
  const [search, setSearch] = useState('');

  const overrides = useMemo(() => (isOpen ? readOverrides() : {}), [isOpen]);
  const pinnedIds = useMemo(() => (isOpen ? readPinned() : []), [isOpen]);
  const saved = useMemo(() => (isOpen ? readSavedCourses() : {}), [isOpen]);

  const sorted = useMemo(() => {
    const withPin = CATEGORIES.map((c) => {
      const o = overrides[c.id];
      const courses = [...(saved[c.id] ?? []), ...c.courses];
      return {
        ...c,
        title: o?.title ?? c.title,
        description: o?.description ?? c.description,
        imageUrl: o?.imageUrl ?? c.imageUrl,
        courses,
        count: c.iconType === 'heart' ? undefined : courses.length,
        isPinned: pinnedIds.includes(c.id),
      };
    });
    return [...withPin].sort((a, b) => {
      const aTop = a.iconType === 'heart' ? 2 : a.isPinned ? 1 : 0;
      const bTop = b.iconType === 'heart' ? 2 : b.isPinned ? 1 : 0;
      return bTop - aTop;
    });
  }, [overrides, pinnedIds, saved]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter((c) =>
      c.courses.some((course) => course.name.toLowerCase().includes(q)),
    );
  }, [search, sorted]);

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="스크랩 저장 위치 선택"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[784px] max-h-[calc(100dvh-env(safe-area-inset-top))] w-full max-w-[390px] flex-col overflow-hidden rounded-t-[20px] bg-surface-white pb-[env(safe-area-inset-bottom)]"
          >
            <header className="relative flex h-[60px] items-center justify-center px-3">
              <button
                type="button"
                onClick={handleClose}
                aria-label="닫기"
                className="absolute left-3 flex size-7 items-center justify-center text-black"
              >
                <BackIcon className="size-6" />
              </button>
              <p className="text-body-lg font-medium text-text-primary">
                어디에 저장할까요?
              </p>
            </header>

            <div className="flex flex-col gap-3 px-5 pt-2">
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
            </div>

            <ul className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 pb-4">
              {filtered.map((cat) => (
                <li key={cat.id}>
                  <ScrapCard
                    data={cat}
                    onClick={() => {
                      onSelect(cat.id, cat.title);
                      setSearch('');
                      onClose();
                    }}
                  />
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
