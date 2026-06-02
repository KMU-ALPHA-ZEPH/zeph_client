import { useEffect, useMemo, useRef, useState } from 'react';
import HeartSolidIcon from '@/assets/icons/mynaui_heart-solid.svg?react';
import { HeartOutlineIcon } from '@/components/common/Icon/HeartOutlineIcon';
import BookmarkIcon from '@/assets/icons/circum_bookmark.svg?react';
import BookmarkFilledIcon from '@/assets/icons/circum_bookmark_filled.svg?react';
import { ShareIcon } from '@/components/common/Icon/ShareIcon';
import { ArrowRightIcon } from '@/components/common/Icon/ArrowRightIcon';
import { textStyles } from '@/styles/tokens';
import { MemoInput } from './components/MemoInput';
import { useLocation, useNavigate } from 'react-router-dom';
import BookmarkToast from '@/pages/popular/BookmarkToast';
import { useSaveToScrap, todayString } from '@/hooks/useSaveToScrap';
import { useTrackingStore } from '@/stores/trackingStore';
import { useCourseStore } from '@/stores/courseStore';
import {
  extractLatLng,
  saveCourse,
  toCourseType,
  toSlopePreference,
} from '@/apis/courses';
import { likeCourse, unlikeCourse } from '@/apis/likes';
import { createScrap, unsetScrapGroup } from '@/apis/scraps';
import {
  createRecord,
  getRecordDetail,
  updateRecordMemo,
} from '@/apis/records';
import CourseMap, { type LatLng } from '@/components/CourseMap';
import ConfirmModal from '@/components/common/ConfirmModal';
import { pathDistanceKm } from '@/utils/geo';
import { formatDuration, formatPace } from '@/utils/format';

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
          <span className={`text-text-secondary ${textStyles['body-medium']}`}>
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
  const [memoSaving, setMemoSaving] = useState(false);
  const [memoStatus, setMemoStatus] = useState('방금 작성됨');
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state ?? {}) as { runId?: number };
  // 통계 페이지에서 들어온 "기록 보기" 모드인지. runId 가 있으면 replay.
  const replayRunId = navState.runId ?? null;
  const [runId, setRunId] = useState<number | null>(replayRunId);
  const summary = useTrackingStore((s) => s.summary);
  const setStoreSummary = useTrackingStore((s) => s.setSummary);
  const result = useCourseStore((s) => s.result);
  const setResult = useCourseStore((s) => s.setResult);
  const form = useCourseStore((s) => s.form);
  const scrapId = useCourseStore((s) => s.currentScrapId);
  const courseId = useCourseStore((s) => s.currentCourseId);
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

  // 트래킹 종료 직후 1회만 백엔드에 러닝 기록을 등록한다.
  // replay 모드면 기록을 새로 만들지 않는다. 초기값을 true 로 둬서 자동 호출을 막는다.
  const recordCreatedRef = useRef(replayRunId !== null);

  // 통계 → 기록 보기로 진입한 경우, 백엔드에서 상세를 가져와 store 를 채운다.
  useEffect(() => {
    if (replayRunId == null) return;
    let cancelled = false;
    getRecordDetail(replayRunId)
      .then((detail) => {
        if (cancelled) return;
        // 거리는 "실제 뛴 거리"가 아니라 "뛰기 전 만들어진 코스의 거리"를 표시한다.
        // (코스 경로 좌표 길이로 계산. 경로가 없으면 기록 거리로 폴백)
        const courseDistanceKm =
          detail.coursePath.length > 1
            ? pathDistanceKm(detail.coursePath)
            : detail.distanceKm;
        setStoreSummary({
          courseName: detail.courseName,
          distanceKm: courseDistanceKm,
          elapsedSec: detail.durationSec,
          // 백엔드 avgPace 는 초/km 단위라 그대로 사용한다.
          paceSecPerKm: detail.avgPace > 0 ? detail.avgPace : 0,
          trackedPath: detail.actualPath,
          trackedPoints: [],
          startTime: detail.startTime,
          endTime: detail.endTime,
          pausedSec: 0,
        });
        // 지도에 추천 경로(=저장된 코스 경로)를 깔기 위해 result 도 채운다.
        setResult({
          totalDistanceKm: courseDistanceKm,
          type: undefined,
          startLat: detail.coursePath[0]?.lat ?? 0,
          startLng: detail.coursePath[0]?.lng ?? 0,
          pathData: { points: detail.coursePath },
        });
        // 좋아요/스크랩 상태 + 메모/이름 동기화
        setCurrent({
          courseId: detail.courseId ?? null,
          scrapId: detail.scrapped
            ? (detail.scrapId ?? -1)
            : (detail.scrapId ?? null),
          courseName: detail.courseName ?? null,
          courseDescription: detail.memo ?? null,
        });
        if (detail.liked && detail.courseId != null) {
          setLikedCourseId(detail.courseId);
        }
        if (detail.memo) {
          setMemo(detail.memo);
          setShowMemo(true);
        }
      })
      .catch((e) => {
        console.error('[TrackingDone] getRecordDetail failed:', e);
      });
    return () => {
      cancelled = true;
    };
  }, [replayRunId, setStoreSummary, setResult, setCurrent]);
  useEffect(() => {
    if (recordCreatedRef.current) return;
    if (!summary || summary.trackedPoints.length === 0) return;
    recordCreatedRef.current = true;
    (async () => {
      try {
        let cid = courseId;
        if (cid == null) {
          // 추천 코스가 아직 저장 안 됐다면 먼저 저장하고 그 id 로 기록을 만든다.
          const saved = await saveCourse({
            name: courseName,
            description: storedDescription?.trim() || undefined,
            type: toCourseType(form.courseType),
            distanceKm: summary.distanceKm,
            pathData: result?.pathData ?? { points: [] },
            roundTrip: result?.roundTrip ?? form.roundTrip ?? true,
            preferLighting: form.lighting === 'bright',
            preferConvenience: form.facility === 'prefer',
            slopePreference: toSlopePreference(form.slope),
          });
          cid = saved.id;
          setCurrent({ courseId: cid });
        }
        const created = await createRecord({
          courseId: cid,
          startTime: summary.startTime,
          endTime: summary.endTime,
          distanceKm: summary.distanceKm,
          durationSec: summary.elapsedSec,
          pausedSec: summary.pausedSec,
          points: summary.trackedPoints,
          pausedSecValid: true,
          timeRangeValid: true,
        });
        // 응답 runId 를 보관해 메모 수정에 사용한다.
        if (created?.runId != null) setRunId(created.runId);
      } catch (e) {
        // 실패해도 화면 표시는 유지. 사용자 재시도는 추후 작업.
        console.error('[TrackingDone] createRecord failed:', e);
        recordCreatedRef.current = false;
      }
    })();
  }, [
    summary,
    courseId,
    courseName,
    storedDescription,
    form.courseType,
    form.roundTrip,
    form.lighting,
    form.facility,
    form.slope,
    result?.pathData,
    result?.roundTrip,
    setCurrent,
  ]);
  const speedText = formatPace(summary?.paceSecPerKm ?? 0);
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

  const handleMemoSave = async () => {
    if (memoSaving) return;
    if (runId == null) {
      alert('아직 기록이 저장되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setMemoSaving(true);
    try {
      await updateRecordMemo(runId, { memo: memo.trim() });
      setMemoStatus('방금 수정됨');
    } catch (e) {
      console.error('[TrackingDone] updateRecordMemo failed:', e);
      alert('메모 저장에 실패했습니다.');
    } finally {
      setMemoSaving(false);
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
        return;
      }
      // 이미 저장된 코스라면 바로 좋아요. 아니면 saveCourse 로 영구 저장 후 likeCourse.
      let targetId = courseId ?? null;
      if (targetId == null) {
        const saved = await saveCourse({
          name: courseName,
          description: storedDescription?.trim() || undefined,
          type: toCourseType(form.courseType),
          distanceKm: result?.totalDistanceKm ?? summary?.distanceKm ?? 0,
          pathData: result?.pathData ?? { points: [] },
          roundTrip: result?.roundTrip ?? form.roundTrip ?? true,
          preferLighting: form.lighting === 'bright',
          preferConvenience: form.facility === 'prefer',
          slopePreference: toSlopePreference(form.slope),
        });
        targetId = saved.id;
        // 이후 좋아요/스크랩 등에 재사용할 수 있도록 store 에도 반영
        setCurrent({ courseId: targetId });
      }
      await likeCourse(targetId);
      setLikedCourseId(targetId);
      setShowLikeToast(true);
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
                {liked ? (
                  <HeartSolidIcon className="size-full transition" />
                ) : (
                  <HeartOutlineIcon className="size-full text-gray-300 transition" />
                )}
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
            <Stat value={speedText} unit="m/km" label="페이스" />
            <Stat value={distanceText} unit="km" label="거리" />
            <Stat value={timeText} label="시간" />
          </div>

          <div className="mt-4">
            {showMemo ? (
              <MemoInput
                value={memo}
                onChange={setMemo}
                onSave={handleMemoSave}
                saving={memoSaving}
                status={memoStatus}
              />
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
