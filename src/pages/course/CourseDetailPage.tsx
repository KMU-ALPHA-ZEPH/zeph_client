import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import { Button } from '@/components/common/Button';
import { textStyles } from '@/styles/tokens';
import BookmarkIcon from '@/assets/icons/circum_bookmark.svg?react';
import BookmarkFilledIcon from '@/assets/icons/circum_bookmark_filled.svg?react';
import { useSaveToScrap, todayString } from '@/hooks/useSaveToScrap';
import CourseMap, { type LatLng } from '@/components/CourseMap';
import { extractLatLng } from '@/apis/courses';
import { useCourseStore, type CourseForm } from '@/stores/courseStore';

/** form 선택값을 사람이 읽을 수 있는 상세 항목/안내 문구로 변환 */
const COURSE_TYPE_LABEL: Record<string, string> = {
  workout: '운동',
  walk: '산책',
  safety: '안전',
};
const SLOPE_LABEL: Record<string, string> = {
  low: '낮음 (평지 위주)',
  normal: '보통 (중간 경사)',
  high: '높음 (오르막 포함)',
};

function buildDetails(form: CourseForm) {
  const details: { label: string; value: string; highlight?: boolean }[] = [];
  if (form.courseType)
    details.push({
      label: '코스 유형',
      value: COURSE_TYPE_LABEL[form.courseType],
      highlight: true,
    });
  details.push({
    label: '조명 선호',
    value: form.lighting === 'bright' ? '가로등 많은 밝은 길' : '상관 없음',
  });
  details.push({
    label: '편의시설',
    value: form.facility === 'prefer' ? '있는 거 선호' : '상관 없음',
  });
  if (form.slope)
    details.push({ label: '경사도', value: SLOPE_LABEL[form.slope] });
  if (form.roundTrip !== null)
    details.push({
      label: '왕복 or 편도',
      value: form.roundTrip ? '왕복' : '편도',
    });
  return details;
}

function buildNotes(form: CourseForm): string[] {
  const notes: string[] = [];
  if (form.courseType === 'workout')
    notes.push('운동 목적에 맞춘 코스를 우선 반영했어요.');
  if (form.courseType === 'walk')
    notes.push('편하게 걷기 좋은 산책 코스를 우선 반영했어요.');
  if (form.lighting === 'bright')
    notes.push('가로등이 많은 밝은 길 위주로 추천했어요.');
  if (form.facility === 'prefer')
    notes.push('편의시설이 있는 구간을 포함했어요.');
  if (form.slope === 'low') notes.push('완만한 평지 중심으로 구성했어요.');
  if (form.slope === 'high') notes.push('오르막이 포함된 코스로 구성했어요.');
  notes.push(
    form.roundTrip === false
      ? '편도로 이동하는 코스예요.'
      : '출발 지점으로 다시 돌아오는 왕복 코스예요.',
  );
  return notes;
}

export default function CourseDetailPage() {
  const navigate = useNavigate();
  const result = useCourseStore((s) => s.result);
  const form = useCourseStore((s) => s.form);
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { requestSave, saveToScrapElement } = useSaveToScrap(() =>
    setBookmarked(true),
  );

  // 결과가 없으면(새로고침 등) 코스 생성 시작 화면으로 보낸다.
  useEffect(() => {
    if (!result) navigate('/course/main', { replace: true });
  }, [result, navigate]);

  // pathData.points 에서 좌표를 견고하게 추출해 추천 경로 배열로 만든다.
  const recommendedPath: LatLng[] = useMemo(
    () =>
      (result?.pathData?.points ?? [])
        .map(extractLatLng)
        .filter((p): p is LatLng => p !== null),
    [result],
  );

  // 진단용: 실제 응답 좌표 형태 확인
  useEffect(() => {
    if (result)
      console.log(
        '[detail] points[0]=',
        result.pathData?.points?.[0],
        '추출된 좌표 수=',
        recommendedPath.length,
      );
  }, [result, recommendedPath.length]);

  if (!result) return null;

  const title = form.startName || '추천 코스';
  const startLat = result.startLat ?? form.startLat ?? 0;
  const startLng = result.startLng ?? form.startLng ?? 0;
  const distanceKm = result.totalDistanceKm ?? form.distanceKm ?? 0;
  const details = buildDetails(form);
  const notes = buildNotes(form);

  const toggleBookmark = () => {
    if (bookmarked) {
      setBookmarked(false);
      return;
    }
    requestSave({ id: 'recommended', name: title, date: todayString() });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative h-dvh w-full overflow-hidden bg-surface-white"
    >
      {/* 배경 지도 + 추천 경로 (살짝 어둡게) */}
      <CourseMap
        recommendedPath={recommendedPath}
        theme="dim"
        className="absolute inset-0 z-0"
      />

      {/* 상단 뒤로가기 */}
      <div className="absolute inset-x-0 top-0 z-30 flex h-[60px] items-center px-3">
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={() => navigate(-1)}
          className="flex size-7 shrink-0 items-center justify-center text-black"
        >
          <BackIcon className="size-7 text-black" />
        </button>
      </div>

      {/* 펼쳤을 때 배경 딤 */}
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

      {/* 하단 시트 (접힘 / 펼침) */}
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
                title={title}
                isBookmarked={bookmarked}
                onBookmark={toggleBookmark}
              />
              <div className="h-4" />
              <InfoRow
                location={`${startLat.toFixed(4)}, ${startLng.toFixed(4)}`}
                distance={`${distanceKm.toFixed(1)}km`}
              />
              <div className="my-5 h-px w-full bg-gray-200" />
              <AIBox notes={notes} />
              <div className="h-3" />
              <DetailList items={details} />
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
          <motion.div
            key="collapsed"
            role="button"
            tabIndex={0}
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
            className="absolute bottom-5 left-1/2 z-20 flex h-[90px] w-[350px] max-w-[calc(100%-32px)] -translate-x-1/2 cursor-pointer flex-col items-stretch rounded-[20px] bg-surface-white px-[18px] pb-4 pt-2 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)]"
          >
            <DragHandle />
            <div className="mt-3">
              <CardHeader
                title={title}
                isBookmarked={bookmarked}
                onBookmark={toggleBookmark}
              />
            </div>
          </motion.div>
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
