import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import ZephIcon from '@/assets/icons/zeph.svg?react';
import HeartIcon from '@/assets/icons/mynaui_heart-solid.svg?react';
import TabBarLayout from '@/components/layout/TabBarLayout';
import ScrapCourseThumb, {
  type ScrapCourseItem,
} from '@/pages/scrap/ScrapCourseThumb';
import EditCategoryModal from '@/pages/scrap/EditCategoryModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { isPinned as readIsPinned, togglePinned } from '@/pages/scrap/pinned';
import { setOverride } from '@/pages/scrap/overrides';

type ScrapCategoryDetail = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  iconType?: 'heart';
  courses: ScrapCourseItem[];
};

const SAMPLE: Record<string, ScrapCategoryDetail> = {
  default: {
    id: 'default',
    title: '산책',
    description: '완만한 경사도, 공원 위주로\n우하하하핳하하하하 최대 두줄임',
    courses: Array.from({ length: 9 }, (_, i) => ({
      id: `c-${i}`,
      name: '뚝섬 한강 공원',
      date: '2025.06.31',
      region: '서울시\n광진구 광장동',
      isBookmarked: true,
    })),
  },
  liked: {
    id: 'liked',
    title: '좋아요 표시한 코스',
    description: '',
    iconType: 'heart',
    courses: Array.from({ length: 6 }, (_, i) => ({
      id: `liked-${i}`,
      name: '뚝섬 한강 공원',
      date: '2025.06.31',
      region: '서울시\n광진구 광장동',
      isBookmarked: true,
    })),
  },
};

type NavState = {
  title?: string;
  description?: string;
  imageUrl?: string;
  iconType?: 'heart';
};

export default function ScrapDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navState = (location.state ?? {}) as NavState;
  const categoryId = id ?? 'default';
  const sample = SAMPLE[categoryId] ?? SAMPLE.default;

  const [title, setTitle] = useState(navState.title ?? sample.title);
  const [description, setDescription] = useState(
    navState.description ?? sample.description,
  );
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    navState.imageUrl ?? sample.imageUrl,
  );
  const [courses, setCourses] = useState(sample.courses);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [pinned, setPinned] = useState(() => readIsPinned(categoryId));
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const isLiked = (navState.iconType ?? sample.iconType) === 'heart';

  const visible = useMemo(
    () => courses.filter((c) => c.isBookmarked !== false),
    [courses],
  );

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    setCourses((prev) =>
      prev.map((c) =>
        c.id === pendingDeleteId ? { ...c, isBookmarked: false } : c,
      ),
    );
  };

  return (
    <div className="flex flex-col px-5">
      <header className="-mx-5 flex h-[60px] items-center px-3">
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
          {isLiked ? (
            <HeartIcon className="size-[60px] text-[#FF5C5C]" />
          ) : imageUrl ? (
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
              className="h-[27px] w-[63px] flex-shrink-0 rounded-[5px] border-[0.5px] border-gray-500 text-body-sm text-gray-500"
            >
              편집
            </button>
            <button
              type="button"
              onClick={() => {
                /* TODO: share */
              }}
              className="h-[27px] w-[63px] flex-shrink-0 rounded-[5px] border-[0.5px] border-gray-500 text-body-sm text-gray-500"
            >
              공유
            </button>
            <button
              type="button"
              onClick={() => {
                togglePinned(categoryId);
                setPinned((v) => !v);
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
        총 {visible.length}개의 코스
      </p>

      <div className="mt-2 h-px bg-gray-400" />

      <ul className="grid grid-cols-3 gap-x-[13px] gap-y-1 pb-[110px] pt-4">
        {visible.map((course) => (
          <li key={course.id}>
            <ScrapCourseThumb
              data={course}
              onBookmarkToggle={() => setPendingDeleteId(course.id)}
            />
          </li>
        ))}
      </ul>

      <TabBarLayout activeTab="scrap" />

      <EditCategoryModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialName={title}
        initialDescription={description}
        initialImageUrl={imageUrl}
        onSubmit={({ name, description: desc, imageUrl: nextImage }) => {
          setTitle(name);
          setDescription(desc);
          setImageUrl(nextImage);
          setOverride(categoryId, {
            title: name,
            description: desc,
            imageUrl: nextImage,
          });
        }}
      />

      <ConfirmModal
        isOpen={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        title="이 산책 경로를 삭제하시겠습니까?"
        message="삭제하면 이 카테고리에서 제거됩니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
