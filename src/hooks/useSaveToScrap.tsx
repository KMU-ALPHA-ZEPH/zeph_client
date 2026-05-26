import { useState, type ReactNode } from 'react';
import SaveToScrapModal from '@/pages/popular/SaveToScrapModal';
import BookmarkToast from '@/pages/popular/BookmarkToast';
import BookmarkFilledIcon from '@/assets/icons/circum_bookmark_filled.svg?react';
import { addSavedCourse } from '@/pages/scrap/savedCourses';
import type { ScrapCourseItem } from '@/pages/scrap/ScrapCourseThumb';

export type SaveCandidate = Omit<ScrapCourseItem, 'isBookmarked'>;

export const todayString = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${mm}.${dd}`;
};

/**
 * 코스를 스크랩 카테고리에 저장하는 공통 플로우.
 * `requestSave(course)`로 카테고리 선택 모달을 열고, 선택하면 저장 후
 * "~에 저장되었습니다" 토스트를 띄운다. 렌더링은 `saveToScrapElement`를 JSX에 두면 된다.
 */
export function useSaveToScrap(
  onSaved?: (
    categoryId: string,
    categoryTitle: string,
    course: SaveCandidate,
  ) => void,
): {
  requestSave: (course: SaveCandidate) => void;
  saveToScrapElement: ReactNode;
} {
  const [pending, setPending] = useState<SaveCandidate | null>(null);
  const [toast, setToast] = useState<{ categoryTitle: string } | null>(null);

  const requestSave = (course: SaveCandidate) => setPending(course);

  const handleSelect = (categoryId: string, categoryTitle: string) => {
    if (pending) {
      addSavedCourse(categoryId, {
        ...pending,
        id: `${pending.id}-${categoryId}`,
        isBookmarked: true,
      });
      setToast({ categoryTitle });
      onSaved?.(categoryId, categoryTitle, pending);
    }
    setPending(null);
  };

  const saveToScrapElement = (
    <>
      <SaveToScrapModal
        isOpen={pending !== null}
        onClose={() => setPending(null)}
        onSelect={handleSelect}
      />
      <BookmarkToast
        isOpen={toast !== null}
        onClose={() => setToast(null)}
        message={`${toast?.categoryTitle ?? ''}에 저장되었습니다`}
        icon={<BookmarkFilledIcon className="text-primary" />}
      />
    </>
  );

  return { requestSave, saveToScrapElement };
}
