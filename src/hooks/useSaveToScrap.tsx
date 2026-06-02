import { useState, type ReactNode } from 'react';
import SaveToScrapModal from '@/pages/popular/SaveToScrapModal';
import BookmarkToast from '@/pages/popular/BookmarkToast';
import BookmarkFilledIcon from '@/assets/icons/circum_bookmark_filled.svg?react';

export type SaveCandidate = {
  id: string;
  name: string;
  date: string;
  region?: string;
  imageUrl?: string;
};

export const todayString = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${mm}.${dd}`;
};

/**
 * 코스를 스크랩 그룹에 저장하는 공통 플로우.
 * `requestSave(course)`로 카테고리 선택 모달을 열고, 선택하면 토스트를 띄운다.
 * 실제 저장은 onSaved 콜백에서 처리한다.
 */
export function useSaveToScrap(
  onSaved?: (groupId: number, groupName: string, course: SaveCandidate) => void,
): {
  requestSave: (course: SaveCandidate) => void;
  saveToScrapElement: ReactNode;
} {
  const [pending, setPending] = useState<SaveCandidate | null>(null);
  const [toast, setToast] = useState<{ groupName: string } | null>(null);

  const requestSave = (course: SaveCandidate) => setPending(course);

  const handleSelect = (groupId: number, groupName: string) => {
    if (pending) {
      setToast({ groupName });
      onSaved?.(groupId, groupName, pending);
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
        message={`${toast?.groupName ?? ''}에 저장되었습니다`}
        icon={<BookmarkFilledIcon className="text-primary" />}
      />
    </>
  );

  return { requestSave, saveToScrapElement };
}
