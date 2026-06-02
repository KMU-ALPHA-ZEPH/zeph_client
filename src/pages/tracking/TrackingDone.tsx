import { useMemo, useState } from 'react';
import HeartSolidIcon from '@/assets/icons/mynaui_heart-solid.svg?react';
import BookmarkIcon from '@/assets/icons/circum_bookmark.svg?react';
import BookmarkFilledIcon from '@/assets/icons/circum_bookmark_filled.svg?react';
import { ShareIcon } from '@/components/common/Icon/ShareIcon';
import { ArrowRightIcon } from '@/components/common/Icon/ArrowRightIcon';
import { textStyles } from '@/styles/tokens';
import { MemoInput } from './components/MemoInput';
import { useNavigate } from 'react-router-dom';
import BookmarkToast from '@/pages/popular/BookmarkToast';
import { useSaveToScrap, todayString } from '@/hooks/useSaveToScrap';
import { useTrackingStore } from '@/stores/trackingStore';
import { useCourseStore } from '@/stores/courseStore';
import { extractLatLng, toCourseType, toSlopePreference } from '@/apis/courses';
import { unlikeCourse } from '@/apis/likes';
import { createScrap, unsetScrapGroup } from '@/apis/scraps';
import CourseMap, { type LatLng } from '@/components/CourseMap';
import ConfirmModal from '@/components/common/ConfirmModal';
import { formatDuration } from '@/utils/format';

function Stat({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex items-end gap-1 whitespace-nowrap">
        <span className={`text-black ${textStyles['number-medium']}`}>
          {value}
        </span>
        {unit && (
          <span className={`text-text-secondary ${textStyles['body-large']}`}>
            {unit}
          </span>
        )}
      </div>
      <span className={`text-gray-500 ${textStyles['body-small-med']}`}>
        {label}
      </span>
    </div>
  );
}

export default function TrackingDone() {
  const [likedCourseId, setLikedCourseId] = useState<number | null>(null);
  const [likeBusy, setLikeBusy] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const [memo, setMemo] = useState('');
  const [showLikeToast, setShowLikeToast] = useState(false);
  const [isUnscrapOpen, setIsUnscrapOpen] = useState(false);
  const navigate = useNavigate();
  const summary = useTrackingStore((s) => s.summary);
  const result = useCourseStore((s) => s.result);
  const form = useCourseStore((s) => s.form);
  const scrapId = useCourseStore((s) => s.currentScrapId);
  const storedName = useCourseStore((s) => s.currentCourseName);
  const storedDescription = useCourseStore((s) => s.currentCourseDescription);
  const setCurrent = useCourseStore((s) => s.setCurrent);
  const saved = scrapId !== null;
  const { requestSave, saveToScrapElement } = useSaveToScrap(
    async (groupId) => {
      try {
        await createScrap({
          groupId,
          courseId: 0,
          courseData: {
            name:
              storedName ||
              summary?.courseName ||
              form.startName ||
              '추천 코스',
            description: storedDescription?.trim() || undefined,
            type: toCourseType(form.courseType),
            distanceKm: result?.totalDistanceKm ?? summary?.distanceKm ?? 0,
            pathData: result?.pathData ?? { points: [] },
            roundTrip: result?.roundTrip ?? form.roundTrip ?? true,
            preferLighting: form.lighting === 'bright',
            preferConvenience: form.facility === 'prefer',
            slopePreference: toSlopePreference(form.slope),
          },
        });
        // 새로 스크랩되었으므로 scrapId 는 별도 조회 없이 임시로 -1 로 표시(활성 상태 유지)
        setCurrent({ scrapId: -1 });
      } catch (e) {
        console.error('[TrackingDone] createScrap failed:', e);
        alert('스크랩 저장에 실패했습니다.');
      }
    },
  );
  const liked = likedCourseId !== null;

  // 추천 경로 + 내가 실제로 뛴 경로를 지도에 함께 표시
  const recommendedPath: LatLng[] = useMemo(
    () =>
      (result?.pathData?.points ?? [])
        .map(extractLatLng)
        .filter((p): p is LatLng => p !== null),
    [result],
  );
  const trackedPath = summary?.trackedPath ?? [];

  const courseName =
    storedName || summary?.courseName || form.startName || '추천 코스';
  const speedText = (summary?.speedKmh ?? 0).toFixed(1);
  const distanceText = (summary?.distanceKm ?? 0).toFixed(2);
  const timeText = formatDuration(summary?.elapsedSec ?? 0);

  const toggleSave = () => {
    if (saved) {
      setIsUnscrapOpen(true);
      return;
    }
    requestSave({
      id: 'tracking-result',
      name: courseName,
      date: todayString(),
    });
  };

  const handleUnscrap = async () => {
    if (scrapId == null || scrapId < 0) {
      // 백엔드 scrapId 없는 임시 활성 상태 → 그냥 비활성화만
      setCurrent({ scrapId: null });
      setIsUnscrapOpen(false);
      return;
    }
    try {
      await unsetScrapGroup(scrapId);
      setCurrent({ scrapId: null });
    } catch (e) {
      console.error('[TrackingDone] unsetScrapGroup failed:', e);
      alert('스크랩 해제에 실패했습니다.');
    } finally {
      setIsUnscrapOpen(false);
    }
  };

  const toggleLike = async () => {
    if (likeBusy) return;
    setLikeBusy(true);
    try {
      if (liked) {
        if (likedCourseId != null) {
          await unlikeCourse(likedCourseId);
        }
        setLikedCourseId(null);
      } else {
        // TODO: 백엔드에 추천 코스 단독 저장 API 가 추가되면 아래 흐름으로 교체.
        //   import { likeCourse } from '@/apis/likes';
        //   const { id } = await saveCourse({ name: courseName, ... });
        //   await likeCourse(id);
        //   setLikedCourseId(id);
        //   setShowLikeToast(true);
        alert(
          '좋아요 기능은 곧 활성화됩니다. 코스 저장 API 연결 후 사용 가능합니다.',
        );
        return;
      }
    } catch (e) {
      console.error('[TrackingDone] toggleLike failed:', e);
      alert('좋아요 처리에 실패했습니다.');
    } finally {
      setLikeBusy(false);
    }
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-surface-white">
      {/* 배경 지도: 추천 경로 + 내가 실제로 뛴 경로 */}
      <CourseMap
        recommendedPath={recommendedPath}
        trackedPath={trackedPath}
        className="absolute inset-0 z-0"
      />

      {/* 하단 그라디언트 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[60%] bg-gradient-to-t from-black/60 via-black/20 to-transparent blur-[2px]" />

      <div className="absolute bottom-[44px] left-1/2 z-20 flex w-[319px] -translate-x-1/2 flex-col gap-3">
        {/* 요약 카드 */}
        <div className="rounded-[10px] bg-surface-white px-5 pb-5 pt-[18px] shadow-[0px_4px_10px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between">
            <span className="text-h2 font-semibold tracking-[-0.4px] text-black">
              {courseName}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="좋아요"
                aria-pressed={liked}
                onClick={toggleLike}
                disabled={likeBusy}
                className="block size-[22px]"
              >
                <HeartSolidIcon
                  className={`size-full transition ${liked ? '' : 'opacity-50 grayscale'}`}
                />
              </button>
              <button
                type="button"
                aria-label="저장"
                aria-pressed={saved}
                onClick={toggleSave}
                className={`block size-[22px] transition-colors ${saved ? 'text-primary' : 'text-gray-300'}`}
              >
                {saved ? (
                  <BookmarkFilledIcon className="size-full" />
                ) : (
                  <BookmarkIcon className="size-full" />
                )}
              </button>
            </div>
          </div>

          <div className="my-[14px] h-px bg-gray-200" />

          <div className="flex justify-between">
            <Stat value={speedText} unit="km/h" label="페이스" />
            <Stat value={distanceText} unit="km" label="거리" />
            <Stat value={timeText} label="시간" />
          </div>

          <div className="mt-4">
            {showMemo ? (
              <MemoInput value={memo} onChange={setMemo} />
            ) : (
              <button
                type="button"
                onClick={() => setShowMemo(true)}
                className={`flex h-[76px] w-full items-center justify-center gap-1 bg-gray-200 rounded-[12px] border border-dashed border-gray-300 text-gray-500 ${textStyles['body-small-med']}`}
              >
                메모 추가하기
              </button>
            )}
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="flex gap-[7px]">
          <button
            type="button"
            className="flex h-[43px] w-[105px] items-center justify-center gap-1.5 rounded-[5px] bg-black text-white shadow-[0px_4px_5px_rgba(0,0,0,0.25)] transition-transform active:scale-95"
          >
            <span className={textStyles['body-small-med']}>공유하기</span>
            <span className="block size-[18px]">
              <ShareIcon />
            </span>
          </button>
          <button
            type="button"
            className="flex h-[43px] flex-1 items-center justify-center gap-1.5 rounded-[5px] bg-black text-white shadow-[0px_4px_5px_rgba(0,0,0,0.25)] transition-transform active:scale-95"
            onClick={() => navigate('/stats')}
          >
            <span className={textStyles['body-small-med']}>
              내 기록 보러가기
            </span>
            <span className="block h-5 w-[18px]">
              <ArrowRightIcon />
            </span>
          </button>
        </div>
      </div>

      <BookmarkToast
        isOpen={showLikeToast}
        onClose={() => setShowLikeToast(false)}
      />

      <ConfirmModal
        isOpen={isUnscrapOpen}
        onClose={() => setIsUnscrapOpen(false)}
        title="스크랩을 해제하시겠습니까?"
        confirmLabel="해제"
        cancelLabel="취소"
        onConfirm={handleUnscrap}
      />

      {saveToScrapElement}
    </div>
  );
}
