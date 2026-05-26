import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import { Button } from '@/components/common/Button';
import { textStyles } from '@/styles/tokens';
import BookmarkIcon from '@/assets/icons/circum_bookmark.svg?react';
import BookmarkFilledIcon from '@/assets/icons/circum_bookmark_filled.svg?react';
import { useSaveToScrap, todayString } from '@/hooks/useSaveToScrap';

type CourseInfo = {
  id: string;
  title: string;
  currentLocation: string;
  targetDistance: string;
  aiNotes: string[];
  details: { label: string; value: string; highlight?: boolean }[];
};

const COURSES: CourseInfo[] = [
  {
    id: 'ttukseom',
    title: '뚝섬 한강 공원',
    currentLocation: '37.5631, 126.9780',
    targetDistance: '5.0km',
    aiNotes: [
      '운동 목적에 맞춰 횡단보도가 적은 코스를 우선 반영했어요.',
      '가로등이 많은 밝은 길 위주로 추천했어요.',
      '편의시설이 있는 구간을 포함했어요.',
      '완만한 경사 중심으로 구성했어요.',
      '출발 지점으로 다시 돌아오는 왕복 코스예요.',
    ],
    details: [
      { label: '코스 유형', value: '운동', highlight: true },
      { label: '조명 선호', value: '가로등 많은 밝은 길' },
      { label: '편의시설', value: '있는 거 선호' },
      { label: '경사도', value: '보통 (중간 경사)' },
      { label: '왕복 or 편도', value: '왕복' },
    ],
  },
  {
    id: 'banpo',
    title: '반포 한강 공원',
    currentLocation: '37.5108, 126.9956',
    targetDistance: '4.2km',
    aiNotes: [
      '야경이 좋은 구간을 우선 포함했어요.',
      '강변 산책로를 중심으로 추천했어요.',
      '편의시설이 잘 갖춰진 구간을 포함했어요.',
      '평지 위주로 부담 없는 코스를 구성했어요.',
      '출발 지점으로 다시 돌아오는 왕복 코스예요.',
    ],
    details: [
      { label: '코스 유형', value: '산책', highlight: true },
      { label: '조명 선호', value: '야경 좋은 길' },
      { label: '편의시설', value: '있는 거 선호' },
      { label: '경사도', value: '낮음 (평지 위주)' },
      { label: '왕복 or 편도', value: '왕복' },
    ],
  },
  {
    id: 'mangwon',
    title: '망원 한강 공원',
    currentLocation: '37.5556, 126.9024',
    targetDistance: '6.5km',
    aiNotes: [
      '한적한 산책로를 우선 반영했어요.',
      '강변 풍경을 즐길 수 있는 구간을 포함했어요.',
      '잔디 광장과 휴식 공간이 있는 코스예요.',
      '완만한 경사 중심으로 구성했어요.',
      '편도로 이동하는 코스예요.',
    ],
    details: [
      { label: '코스 유형', value: '운동', highlight: true },
      { label: '조명 선호', value: '자연광 위주' },
      { label: '편의시설', value: '상관 없음' },
      { label: '경사도', value: '보통 (중간 경사)' },
      { label: '왕복 or 편도', value: '편도' },
    ],
  },
  {
    id: 'jamsil',
    title: '잠실 한강 공원',
    currentLocation: '37.5172, 127.0816',
    targetDistance: '7.0km',
    aiNotes: [
      '운동 시설 주변 코스를 우선 반영했어요.',
      '가로등이 많은 밝은 길 위주로 추천했어요.',
      '편의시설이 풍부한 구간을 포함했어요.',
      '약간의 오르막이 포함된 코스예요.',
      '출발 지점으로 다시 돌아오는 왕복 코스예요.',
    ],
    details: [
      { label: '코스 유형', value: '운동', highlight: true },
      { label: '조명 선호', value: '가로등 많은 밝은 길' },
      { label: '편의시설', value: '있는 거 선호' },
      { label: '경사도', value: '높음 (오르막 포함)' },
      { label: '왕복 or 편도', value: '왕복' },
    ],
  },
  {
    id: 'yeouido',
    title: '여의도 한강 공원',
    currentLocation: '37.5283, 126.9326',
    targetDistance: '5.5km',
    aiNotes: [
      '벚꽃길 구간을 우선 포함했어요.',
      '강변 산책로를 중심으로 추천했어요.',
      '편의시설이 잘 갖춰진 구간을 포함했어요.',
      '평지 위주로 구성했어요.',
      '출발 지점으로 다시 돌아오는 왕복 코스예요.',
    ],
    details: [
      { label: '코스 유형', value: '산책', highlight: true },
      { label: '조명 선호', value: '가로등 많은 밝은 길' },
      { label: '편의시설', value: '있는 거 선호' },
      { label: '경사도', value: '낮음 (평지 위주)' },
      { label: '왕복 or 편도', value: '왕복' },
    ],
  },
];

const SWIPE_THRESHOLD = 60;

export default function CourseDetailPage() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState<boolean[]>(() =>
    COURSES.map(() => false),
  );
  const { requestSave, saveToScrapElement } = useSaveToScrap(() =>
    setBookmarked((prev) => prev.map((v, i) => (i === pageIndex ? true : v))),
  );

  const course = COURSES[pageIndex];
  const isBookmarked = bookmarked[pageIndex];

  const goPrev = () => setPageIndex((p) => Math.max(0, p - 1));
  const goNext = () => setPageIndex((p) => Math.min(COURSES.length - 1, p + 1));

  const handlePageDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
  };

  const toggleBookmark = () => {
    if (isBookmarked) {
      setBookmarked((prev) =>
        prev.map((v, i) => (i === pageIndex ? false : v)),
      );
      return;
    }
    requestSave({
      id: course.id,
      name: course.title,
      date: todayString(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative h-dvh w-full overflow-hidden bg-surface-white"
    >
      {/* Map placeholder (gray) — swipeable to change pages */}
      <motion.div
        className="absolute inset-0 z-0 cursor-grab bg-gray-200 active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handlePageDragEnd}
      />

      {/* Top header: back + page dots — pointer-events-none so swipe passes through to map */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-[60px] items-center px-3">
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={() => navigate(-1)}
          className="pointer-events-auto flex size-7 shrink-0 items-center justify-center text-black"
        >
          <BackIcon className="size-7 text-black" />
        </button>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <PageDots count={COURSES.length} active={pageIndex} />
        </div>
      </div>

      {/* Backdrop — tap to close when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={() => setExpanded(false)}
            className="absolute inset-0 z-10 bg-black/20"
          />
        )}
      </AnimatePresence>

      {/* Bottom sheet (collapsed / expanded) */}
      <AnimatePresence initial={false} mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.45,
              ease: [0.4, 0, 0.2, 1],
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) setExpanded(false);
            }}
            className="absolute bottom-0 left-1/2 z-20 flex w-[350px] max-w-[calc(100%-32px)] -translate-x-1/2 flex-col rounded-t-[20px] bg-surface-white pb-8 shadow-[0px_-4px_10px_0px_rgba(0,0,0,0.15)]"
          >
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="모달 닫기"
              className="flex w-full cursor-pointer flex-col items-center pb-2 pt-3"
            >
              <span className="block h-[5px] w-[70px] rounded-full bg-[rgba(141,141,141,0.3)]" />
            </button>
            <div className="px-[18px] pt-4">
              <CardHeader
                title={course.title}
                isBookmarked={isBookmarked}
                onBookmark={toggleBookmark}
              />
              <div className="h-4" />
              <InfoRow
                location={course.currentLocation}
                distance={course.targetDistance}
              />
              <div className="my-5 h-px w-full bg-gray-200" />
              <AIBox notes={course.aiNotes} />
              <div className="h-3" />
              <DetailList items={course.details} />
            </div>
            <div className="mt-6 flex justify-center px-6">
              <Button
                className="w-full"
                onClick={() => navigate('/tracking/start')}
              >
                러닝 시작하기
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            type="button"
            onClick={() => setExpanded(true)}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.45,
              ease: [0.4, 0, 0.2, 1],
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.y < -40) setExpanded(true);
            }}
            className="absolute bottom-5 left-1/2 z-20 flex h-[90px] w-[350px] max-w-[calc(100%-32px)] -translate-x-1/2 flex-col items-stretch rounded-[20px] bg-surface-white px-[18px] pb-4 pt-2 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)]"
          >
            <DragHandle />
            <div className="mt-3">
              <CardHeader
                title={course.title}
                isBookmarked={isBookmarked}
                onBookmark={toggleBookmark}
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {saveToScrapElement}
    </motion.div>
  );
}

function DragHandle() {
  return (
    <div className="flex w-full justify-center pt-2">
      <span className="block h-[5px] w-[70px] rounded-full bg-[rgba(141,141,141,0.3)]" />
    </div>
  );
}

function PageDots({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`block size-2 rounded-full transition-colors ${
            i === active ? 'bg-primary' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

function CardHeader({
  title,
  isBookmarked,
  onBookmark,
}: {
  title: string;
  isBookmarked: boolean;
  onBookmark: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <h2 className={`${textStyles['heading-h2']} text-text-primary`}>
        {title}
      </h2>
      <button
        type="button"
        aria-label={isBookmarked ? '북마크 해제' : '북마크'}
        onClick={(e) => {
          e.stopPropagation();
          onBookmark();
        }}
        className={`flex size-6 items-center justify-center transition-colors ${
          isBookmarked ? 'text-primary' : 'text-gray-500'
        }`}
      >
        {isBookmarked ? (
          <BookmarkFilledIcon className="size-[23px]" />
        ) : (
          <BookmarkIcon className="size-[23px]" />
        )}
      </button>
    </div>
  );
}

function InfoRow({
  location,
  distance,
}: {
  location: string;
  distance: string;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-1">
        <PinIcon className="size-4 text-primary" />
        <span className={`${textStyles['body-small-med']} text-text-primary`}>
          시작 위치
        </span>
        <span className={`${textStyles['body-small']} text-[#667080]`}>
          {location}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className={`${textStyles['body-small-med']} text-primary`}
          aria-hidden
        >
          ⇄
        </span>
        <span className={`${textStyles['body-small-med']} text-text-primary`}>
          목표 거리
        </span>
        <span className={`${textStyles['body-small-med']} text-primary`}>
          {distance}
        </span>
      </div>
    </div>
  );
}

function AIBox({ notes }: { notes: string[] }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-[15px] bg-gray-100 px-3 pb-4 pt-3">
      <div className="flex items-center gap-2">
        <span
          className={`${textStyles['body-small-med']} text-primary`}
          aria-hidden
        >
          ✦
        </span>
        <p className={`${textStyles['body-small-med']} text-text-primary`}>
          AI가 입력한 선호 조건을 반영해 생성한 코스예요.
        </p>
      </div>
      <ul className="flex flex-col gap-1 pl-2">
        {notes.map((note, i) => (
          <li key={i} className="flex items-start gap-2">
            <span
              aria-hidden
              className="mt-1 block size-[3px] shrink-0 rounded-full bg-primary"
            />
            <span className={`${textStyles['footnote']} text-text-primary`}>
              {note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetailList({
  items,
}: {
  items: { label: string; value: string; highlight?: boolean }[];
}) {
  return (
    <ul className="flex w-full flex-col gap-3">
      {items.map((item) => (
        <li key={item.label} className="flex items-center justify-between py-1">
          <span className={`${textStyles['body-small-med']} text-text-primary`}>
            {item.label}
          </span>
          {item.highlight ? (
            <span className="flex h-6 items-center rounded-full bg-[#ebfaf0] px-3">
              <span
                className={`${textStyles['body-small']} font-bold text-[#2ed973]`}
              >
                {item.value}
              </span>
            </span>
          ) : (
            <span className={`${textStyles['body-small']} text-[#667080]`}>
              {item.value}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function PinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5Z"
        fill="currentColor"
      />
      <circle cx="8" cy="6" r="1.5" fill="white" />
    </svg>
  );
}
