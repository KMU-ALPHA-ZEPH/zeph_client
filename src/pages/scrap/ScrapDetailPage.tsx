import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import ZephIcon from '@/assets/icons/zeph.svg?react';
import TabBarLayout from '@/components/layout/TabBarLayout';
import EditCategoryModal from '@/pages/scrap/EditCategoryModal';
import ScrapCourseThumb from '@/pages/scrap/ScrapCourseThumb';
import ConfirmModal from '@/components/common/ConfirmModal';
import { isPinned as readIsPinned, togglePinned } from '@/pages/scrap/pinned';
import { deleteGroup, getGroups, updateGroup } from '@/apis/groups';
import {
  getScrapsByGroup,
  deleteScrap,
  type ScrapPreviewResponse,
} from '@/apis/scraps';
import { getCourseDetail } from '@/apis/courses';
import { useCourseStore } from '@/stores/courseStore';

type NavState = {
  title?: string;
  description?: string;
  imageUrl?: string;
};

const TYPE_TO_FORM: Record<string, 'workout' | 'walk' | 'safety' | null> = {
  walk: 'walk',
  safety: 'safety',
  exercise: 'workout',
  workout: 'workout',
};

export default function ScrapDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navState = (location.state ?? {}) as NavState;
  const groupId = id ? Number(id) : NaN;

  const [title, setTitle] = useState(navState.title ?? '');
  const [description, setDescription] = useState(navState.description ?? '');
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    navState.imageUrl,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [scraps, setScraps] = useState<ScrapPreviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(false);
  const [pinned, setPinned] = useState(() =>
    Number.isFinite(groupId) ? readIsPinned(groupId) : false,
  );

  const setResult = useCourseStore((s) => s.setResult);
  const setForm = useCourseStore((s) => s.setForm);
  const resetCourse = useCourseStore((s) => s.reset);

  useEffect(() => {
    if (!Number.isFinite(groupId)) {
      setError('잘못된 카테고리입니다.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getScrapsByGroup(groupId)
      .then((data) => setScraps(data))
      .catch((e) => {
        console.error('[ScrapDetailPage] getScrapsByGroup failed:', e);
        setError('스크랩 목록을 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));

    // 새로고침/직접 진입 시 navState가 비어있으므로 그룹 메타정보를 백엔드에서 보강
    getGroups()
      .then((groups) => {
        const g = groups.find((x) => x.id === groupId);
        if (!g) return;
        setTitle((prev) => prev || g.name);
        setDescription((prev) => prev || g.description || '');
        setImageUrl(g.imageUrl);
      })
      .catch(() => {
        // ignore: fall back to navState
      });
  }, [groupId]);

  const handleEdit = async ({
    name,
    description: desc,
    imageUrl: nextImage,
    imageFile,
  }: {
    name: string;
    description: string;
    imageUrl?: string;
    imageFile?: File;
  }) => {
    if (!Number.isFinite(groupId)) {
      alert('잘못된 카테고리입니다.');
      return;
    }
    try {
      await updateGroup(groupId, {
        name,
        description: desc,
        image: imageFile,
      });
      setTitle(name);
      setDescription(desc);
      setImageUrl(nextImage);
      // PATCH 응답에 새 image URL이 없으므로 GET으로 보강
      try {
        const groups = await getGroups();
        const fresh = groups.find((g) => g.id === groupId);
        if (fresh?.imageUrl) setImageUrl(fresh.imageUrl);
      } catch {
        // ignore: keep preview URL
      }
    } catch {
      alert('카테고리 수정에 실패했습니다.');
    }
  };

  const confirmDelete = async () => {
    if (pendingDeleteId == null) return;
    try {
      await deleteScrap(pendingDeleteId);
      setScraps((prev) => prev.filter((s) => s.scrapId !== pendingDeleteId));
    } catch (e) {
      console.error('[ScrapDetailPage] deleteScrap failed:', e);
      alert('스크랩 제거에 실패했습니다.');
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleDeleteGroupRequest = () => {
    setIsEditOpen(false);
    setIsDeleteGroupOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (!Number.isFinite(groupId) || deletingGroup) return;
    setDeletingGroup(true);
    try {
      await deleteGroup(groupId);
      setIsDeleteGroupOpen(false);
      navigate('/scrap', { replace: true });
    } catch (e) {
      console.error('[ScrapDetailPage] deleteGroup failed:', e);
      alert('카테고리 삭제에 실패했습니다.');
    } finally {
      setDeletingGroup(false);
    }
  };

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
        courseType: TYPE_TO_FORM[detail.type] ?? null,
      });
      setResult({
        totalDistanceKm: detail.distanceKm,
        type: detail.type,
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

  return (
    <div className="flex flex-col px-5">
      <header className="sticky top-0 z-10 -mx-5 flex h-[calc(60px+env(safe-area-inset-top))] items-center bg-surface-white px-3 pt-[env(safe-area-inset-top)]">
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={() => navigate(-1)}
          className="flex size-7 items-center justify-center text-black"
        >
          <BackIcon className="size-6" />
        </button>
      </header>

      <section className="flex gap-[14px]">
        <div className="grid size-[120px] flex-shrink-0 place-items-center overflow-hidden rounded-[10px] bg-gray-300">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <ZephIcon className="h-full w-full" />
          )}
        </div>
        <div className="flex h-[120px] w-[216px] flex-shrink-0 flex-col">
          <div className="flex flex-1 flex-col justify-center">
            <h1 className="truncate text-h2 font-semibold text-text-primary">
              {title}
            </h1>
            <p className="line-clamp-2 h-10 overflow-hidden whitespace-pre-line text-ellipsis break-words text-body-md text-text-secondary">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="h-[27px] w-[132px] flex-shrink-0 rounded-[5px] border-[0.5px] border-gray-500 text-body-sm text-gray-500"
            >
              편집
            </button>
            <button
              type="button"
              onClick={() => {
                if (!Number.isFinite(groupId)) return;
                const next = togglePinned(groupId);
                setPinned(next);
              }}
              className={`h-[27px] w-[63px] flex-shrink-0 rounded-[5px] border-[0.5px] text-body-sm ${
                pinned
                  ? 'border-primary text-primary'
                  : 'border-gray-500 text-gray-500'
              }`}
            >
              고정
            </button>
          </div>
        </div>
      </section>

      <p className="mt-5 text-body-sm text-text-primary">
        총 {scraps.length}개의 코스
      </p>

      <div className="mt-2 h-px bg-gray-400" />

      {loading ? (
        <p className="mt-10 self-center text-body-sm text-gray-500">
          불러오는 중...
        </p>
      ) : error ? (
        <p className="mt-10 self-center text-body-sm text-status-error">
          {error}
        </p>
      ) : scraps.length === 0 ? (
        <p className="mt-10 self-center text-body-sm text-gray-500">
          아직 스크랩된 코스가 없습니다
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-x-[13px] gap-y-1 pb-[110px] pt-4">
          {scraps.map((s) => (
            <li key={s.scrapId}>
              <ScrapCourseThumb
                data={{
                  id: String(s.scrapId),
                  name: s.name,
                  description: s.description,
                  region: s.region,
                  coursePath: s.coursePath,
                  isBookmarked: true,
                }}
                onClick={() => handleOpenCourse(s)}
                onBookmarkToggle={() => setPendingDeleteId(s.scrapId)}
              />
            </li>
          ))}
        </ul>
      )}

      <TabBarLayout activeTab="scrap" />

      <EditCategoryModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialName={title}
        initialDescription={description}
        initialImageUrl={imageUrl}
        onSubmit={handleEdit}
        onDelete={handleDeleteGroupRequest}
      />

      <ConfirmModal
        isOpen={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        title="이 코스를 삭제하시겠습니까?"
        message="스크랩 목록에서 완전히 사라집니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={confirmDelete}
      />

      <ConfirmModal
        isOpen={isDeleteGroupOpen}
        onClose={() => setIsDeleteGroupOpen(false)}
        title="카테고리를 삭제하시겠습니까?"
        message="카테고리에 담긴 스크랩도 함께 정리됩니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={confirmDeleteGroup}
      />
    </div>
  );
}
