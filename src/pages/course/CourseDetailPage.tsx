import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import { Button } from '@/components/common/Button';
import { textStyles } from '@/styles/tokens';
import BookmarkIcon from '@/assets/icons/circum_bookmark.svg?react';
import BookmarkFilledIcon from '@/assets/icons/circum_bookmark_filled.svg?react';
import { useSaveToScrap, todayString } from '@/hooks/useSaveToScrap';
import CourseMap, { type LatLng } from '@/components/CourseMap';
import {
  extractLatLng,
  getCourseGpx,
  toCourseType,
  toSlopePreference,
  updateCourse,
} from '@/apis/courses';
import { ShareIcon } from '@/components/common/Icon/ShareIcon';
import { createScrap, deleteScrap } from '@/apis/scraps';
import ConfirmModal from '@/components/common/ConfirmModal';
import CourseEditModal from '@/pages/course/CourseEditModal';
import {
  buildColoredSegments,
  buildParkMarkers,
} from '@/pages/course/courseSegmentColors';
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
  const location = useLocation();
  const navState = (location.state ?? {}) as {
    scrapId?: number;
    courseId?: number;
    initialName?: string;
    initialDescription?: string;
    editable?: boolean;
  };
  const result = useCourseStore((s) => s.result);
  const form = useCourseStore((s) => s.form);
  const scrapId = useCourseStore((s) => s.currentScrapId);
  const courseId = useCourseStore((s) => s.currentCourseId);
  const storedName = useCourseStore((s) => s.currentCourseName);
  const storedDescription = useCourseStore((s) => s.currentCourseDescription);
  const setCurrent = useCourseStore((s) => s.setCurrent);
  const [expanded, setExpanded] = useState(false);
  const [isUnscrapOpen, setIsUnscrapOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [pathMode, setPathMode] = useState<'slope' | 'safety'>('slope');
  const [shareBusy, setShareBusy] = useState(false);

  // 진입 시 navState 로 받은 식별자/이름/설명을 store 에 반영해 다음 화면까지 공유한다.
  useEffect(() => {
    setCurrent({
      courseId: navState.courseId ?? null,
      scrapId: navState.scrapId ?? null,
      courseName: navState.initialName ?? form.startName ?? null,
      courseDescription: navState.initialDescription ?? null,
    });
    // form.startName 은 진입 시점의 기본값으로만 쓰고 변경은 추적하지 않는다.
  }, [
    navState.courseId,
    navState.scrapId,
    navState.initialName,
    navState.initialDescription,
    setCurrent,
  ]);

  const displayName = storedName || form.startName || '추천 코스';
  const displayDescription = storedDescription ?? '';
  const bookmarked = scrapId !== null;
  const { requestSave, saveToScrapElement } = useSaveToScrap(
    async (groupId) => {
      if (!result) return;
      try {
        // 이미 저장된 코스라면 courseId 로 묶고, 새 추천 코스만 courseData 로 생성한다.
        await createScrap({
          groupId,
          courseId: courseId ?? 0,
          courseData:
            courseId != null
              ? undefined
              : {
                  name: storedName || form.startName || '추천 코스',
                  description: storedDescription?.trim() || undefined,
                  type: toCourseType(form.courseType),
                  distanceKm: result.totalDistanceKm ?? form.distanceKm ?? 0,
                  pathData: result.pathData ?? { points: [] },
                  roundTrip: result.roundTrip ?? form.roundTrip ?? true,
                  preferLighting: form.lighting === 'bright',
                  preferConvenience: form.facility === 'prefer',
                  slopePreference: toSlopePreference(form.slope),
                },
        });
        // 새로 스크랩되었으므로 scrapId 는 별도 조회 없이 임시로 -1로 표시(활성 상태 유지)
        setCurrent({ scrapId: -1 });
      } catch (e) {
        console.error('[CourseDetailPage] createScrap failed:', e);
        alert('스크랩 저장에 실패했습니다.');
      }
    },
  );

  const handleShare = async () => {
    if (shareBusy) return;
    if (courseId == null) {
      alert('아직 저장되지 않은 코스라 공유할 수 없습니다.');
      return;
    }
    setShareBusy(true);
    try {
      const gpx = await getCourseGpx(courseId);
      console.log(
        '[share] gpx typeof:',
        typeof gpx,
        'sample:',
        String(gpx).slice(0, 80),
      );
      const fileName = `${displayName || 'course'}.gpx`;
      const blob = new Blob([gpx], { type: 'application/gpx+xml' });
      const file = new File([blob], fileName, { type: 'application/gpx+xml' });
      const isMobile =
        typeof navigator !== 'undefined' &&
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (
        isMobile &&
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({ files: [file], title: displayName });
      } else {
        // 데스크톱 또는 share API 미지원 → 파일 다운로드
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      if (
        e instanceof DOMException &&
        (e.name === 'AbortError' || e.name === 'NotAllowedError')
      ) {
        return;
      }
      console.error('[CourseDetailPage] getCourseGpx failed:', e);
      alert('공유에 실패했습니다.');
    } finally {
      setShareBusy(false);
    }
  };

  const handleUnscrap = async () => {
    if (scrapId == null || scrapId < 0) {
      // 백엔드 scrapId 없는 임시 활성 상태 → 그냥 비활성화만
      setCurrent({ scrapId: null });
      setIsUnscrapOpen(false);
      return;
    }
    try {
      await deleteScrap(scrapId);
      setCurrent({ scrapId: null });
    } catch (e) {
      console.error('[CourseDetailPage] deleteScrap failed:', e);
      alert('스크랩 해제에 실패했습니다.');
    } finally {
      setIsUnscrapOpen(false);
    }
  };

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

  // 모드별로 segment 색 + 공원 마커 계산
  const coloredSegments = useMemo(
    () => buildColoredSegments(result?.pathData?.points, pathMode),
    [result, pathMode],
  );
  const parkMarkers = useMemo(
    () => buildParkMarkers(result?.pathData?.points),
    [result],
  );

  if (!result) return null;

  const title = displayName;
  const handleEditSubmit = async ({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) => {
    // 아직 저장 안 된 추천 코스도 편집은 허용한다. 값은 store 에 보관했다가
    // 스크랩 저장 시점에 createScrap 의 courseData 로 함께 전송된다.
    if (!courseId) {
      setCurrent({ courseName: name, courseDescription: description });
      return;
    }
    try {
      await updateCourse(courseId, { name, description });
      setCurrent({ courseName: name, courseDescription: description });
    } catch (e) {
      console.error('[CourseDetailPage] updateCourse failed:', e);
      alert('코스 수정에 실패했습니다.');
    }
  };
  const startLat = result.startLat ?? form.startLat ?? 0;
  const startLng = result.startLng ?? form.startLng ?? 0;
  const startLocation =
    form.startAddress?.trim() ||
    `${startLat.toFixed(4)}, ${startLng.toFixed(4)}`;
  const distanceKm = result.totalDistanceKm ?? form.distanceKm ?? 0;
  const details = buildDetails(form);
  const notes = buildNotes(form);

  const toggleBookmark = () => {
    if (bookmarked) {
      setIsUnscrapOpen(true);
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
      {/* 배경 지도 + 추천 경로 (살짝 어둡게).
          segment 모드 활성화 시 coloredSegments 가 단색 라인 대신 그려진다. */}
      <CourseMap
        recommendedPath={recommendedPath}
        coloredSegments={coloredSegments}
        parkMarkers={parkMarkers}
        showEndpoints
        theme="dim"
        className="absolute inset-0 z-0"
      />

      {/* 경사도/안전도 모드 토글 + 색 범례 */}
      <div className="absolute right-3 top-[calc(60px+env(safe-area-inset-top)+8px)] z-30 flex flex-col items-end gap-1.5">
        <div className="flex overflow-hidden rounded-[8px] bg-surface-white shadow-base">
          <button
            type="button"
            onClick={() => setPathMode('slope')}
            className={`px-3 py-1.5 text-body-sm ${
              pathMode === 'slope'
                ? 'bg-primary text-white'
                : 'text-text-secondary'
            }`}
          >
            경사도
          </button>
          <button
            type="button"
            onClick={() => setPathMode('safety')}
            className={`px-3 py-1.5 text-body-sm ${
              pathMode === 'safety'
                ? 'bg-primary text-white'
                : 'text-text-secondary'
            }`}
          >
            안전도
          </button>
        </div>

        <div className="flex flex-col gap-1 rounded-[8px] bg-surface-white px-3 py-2 shadow-base">
          {(pathMode === 'slope'
            ? [
                { color: '#17e39c', label: '평지' },
                { color: '#ff7d4a', label: '오르막' },
                { color: '#4aa9ff', label: '내리막' },
              ]
            : [
                { color: '#17e39c', label: '안전' },
                { color: '#ffb547', label: '보통' },
                { color: '#ff5c5c', label: '주의' },
              ]
          ).map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-[3px] w-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] text-text-secondary">
                {item.label}
              </span>
            </div>
          ))}
          <div className="mt-1 flex items-center gap-1.5 border-t border-gray-200 pt-1.5">
            <span
              aria-hidden
              className="flex h-[14px] w-[14px] items-center justify-center rounded-full border border-white bg-[#2ed973] text-[8px] font-bold text-white"
            >
              P
            </span>
            <span className="text-[11px] text-text-secondary">공원 근처</span>
          </div>
        </div>
      </div>

      {/* 상단 뒤로가기 */}
      <div className="absolute inset-x-0 top-0 z-30 flex h-[calc(60px+env(safe-area-inset-top))] items-center px-3 pt-[env(safe-area-inset-top)]">
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
                description={displayDescription}
                isBookmarked={bookmarked}
                onBookmark={toggleBookmark}
                canEdit={navState.editable !== false}
                onEdit={() => setIsEditOpen(true)}
                onShare={handleShare}
                shareBusy={shareBusy}
              />
              <div className="h-4" />
              <InfoRow
                location={startLocation}
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
                description={displayDescription}
                isBookmarked={bookmarked}
                onBookmark={toggleBookmark}
                canEdit={navState.editable !== false}
                onEdit={() => setIsEditOpen(true)}
                onShare={handleShare}
                shareBusy={shareBusy}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {saveToScrapElement}

      <ConfirmModal
        isOpen={isUnscrapOpen}
        onClose={() => setIsUnscrapOpen(false)}
        title="스크랩을 해제하시겠습니까?"
        confirmLabel="해제"
        cancelLabel="취소"
        onConfirm={handleUnscrap}
      />

      <CourseEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialName={displayName}
        initialDescription={displayDescription}
        onSubmit={handleEditSubmit}
      />
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
  description,
  isBookmarked,
  onBookmark,
  canEdit,
  onEdit,
  onShare,
  shareBusy,
}: {
  title: string;
  description?: string;
  isBookmarked: boolean;
  onBookmark: () => void;
  canEdit?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
  shareBusy?: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex w-full items-center justify-between gap-2">
        <h2
          className={`${textStyles['heading-h2']} truncate text-text-primary`}
        >
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {onShare && (
            <button
              type="button"
              aria-label="코스 공유"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              disabled={shareBusy}
              className="flex size-6 items-center justify-center text-gray-500 disabled:opacity-50"
            >
              <ShareIcon className="size-[18px]" />
            </button>
          )}
          {canEdit && onEdit && (
            <button
              type="button"
              aria-label="코스 편집"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex size-6 items-center justify-center text-gray-500"
            >
              <EditPencilIcon className="size-[18px]" />
            </button>
          )}
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
      </div>
      {description && (
        <p
          className={`${textStyles['body-small']} line-clamp-2 text-text-secondary`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function EditPencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" {...props}>
      <path
        d="M11.7 3.6L14.4 6.3M2.7 15.3L3.6 11.7L11.7 3.6L14.4 6.3L6.3 14.4L2.7 15.3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <PinIcon className="size-4 shrink-0 text-primary" />
        <span
          className={`${textStyles['body-small-med']} shrink-0 text-text-primary`}
        >
          시작 위치
        </span>
        <span className={`${textStyles['body-small']} truncate text-[#667080]`}>
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
