import { useState } from 'react';
import { HeartIcon } from '@/components/common/Icon/HeartIcon';
import { BookmarkIcon } from '@/components/common/Icon/BookmarkIcon';
import { ShareIcon } from '@/components/common/Icon/ShareIcon';
import { ArrowRightIcon } from '@/components/common/Icon/ArrowRightIcon';
import { textStyles } from '@/styles/tokens';
import { MemoInput } from './components/MemoInput';
import { useNavigate } from 'react-router-dom';

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
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const [memo, setMemo] = useState('');
  const navigate = useNavigate();

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-surface-white">
      {/* 배경 이미지 영역 (추후 코스/지도 이미지로 교체) */}
      <div className="absolute inset-0 z-0 bg-gray-400" />

      {/* 하단 그라디언트 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[60%] bg-gradient-to-t from-black/60 via-black/20 to-transparent blur-[2px]" />

      <div className="absolute bottom-[80px] left-1/2 z-20 flex w-[319px] -translate-x-1/2 flex-col gap-3">
        {/* 요약 카드 */}
        <div className="rounded-[10px] bg-surface-white px-5 pb-5 pt-[18px] shadow-[0px_4px_10px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between">
            <span className="text-h2 font-semibold tracking-[-0.4px] text-black">
              뚝섬 한강 공원
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="좋아요"
                aria-pressed={liked}
                onClick={() => setLiked((prev) => !prev)}
                className={`block size-[22px] transition-colors ${liked ? 'text-status-error' : 'text-gray-300'}`}
              >
                <HeartIcon />
              </button>
              <button
                type="button"
                aria-label="저장"
                aria-pressed={saved}
                onClick={() => setSaved((prev) => !prev)}
                className={`block size-[22px] transition-colors ${saved ? 'text-primary' : 'text-gray-300'}`}
              >
                <BookmarkIcon />
              </button>
            </div>
          </div>

          <div className="my-[14px] h-px bg-gray-200" />

          <div className="flex justify-between">
            <Stat value="6" unit="km/h" label="페이스" />
            <Stat value="3.54" unit="km" label="거리" />
            <Stat value="00:48" label="시간" />
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
    </div>
  );
}
