import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import ScrapCard from '@/pages/scrap/ScrapCard';
import { getGroups, type GroupResponse } from '@/apis/groups';
import { LIKED_GROUP_NAME } from '@/apis/likes';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (groupId: number, groupName: string) => void;
};

export default function SaveToScrapModal({ isOpen, onClose, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    getGroups()
      .then((data) =>
        // 좋아요 표시한 경로는 좋아요로만 들어가는 곳이라 임의 저장 불가
        setGroups(data.filter((g) => g.name !== LIKED_GROUP_NAME)),
      )
      .catch(() => setError('스크랩 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups.filter((g) => g.name.toLowerCase().includes(q));
  }, [search, groups]);

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

            {loading ? (
              <p className="flex-1 py-10 text-center text-body-sm text-gray-500">
                불러오는 중...
              </p>
            ) : error ? (
              <p className="flex-1 py-10 text-center text-body-sm text-status-error">
                {error}
              </p>
            ) : filtered.length === 0 ? (
              <p className="flex-1 py-10 text-center text-body-sm text-gray-500">
                {search.trim()
                  ? '검색 결과가 없습니다'
                  : '스크랩한 카테고리가 없습니다'}
              </p>
            ) : (
              <ul className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 pb-4">
                {filtered.map((group) => (
                  <li key={group.id}>
                    <ScrapCard
                      data={{
                        id: String(group.id),
                        title: group.name,
                        count: group.courseCount,
                      }}
                      onClick={() => {
                        onSelect(group.id, group.name);
                        setSearch('');
                        onClose();
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
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
