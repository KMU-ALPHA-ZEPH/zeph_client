import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PauseIcon } from '@/components/common/Icon/PauseIcon';
import { PlayIcon } from '@/components/common/Icon/PlayIcon';
import { GoEndIcon } from '@/components/common/Icon/GoEndIcon';
import { textStyles } from '@/styles/tokens';

function formatElapsed(totalSec: number) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad(h)} : ${pad(m)} : ${pad(s)}`;
}

function StatCard({
  value,
  unit,
  label,
}: {
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex h-[82px] w-[150px] flex-col items-start rounded-[10px] bg-surface-white px-5 pb-4 pt-3 shadow-[0px_4px_10px_rgba(0,0,0,0.25)]">
      <div className="flex items-end gap-1 whitespace-nowrap">
        <span className={`text-black ${textStyles['number-large']}`}>
          {value}
        </span>
        <span className={`text-text-secondary ${textStyles['body-large']}`}>
          {unit}
        </span>
      </div>
      <span className={`text-gray-500 ${textStyles['body-small-med']}`}>
        {label}
      </span>
    </div>
  );
}

export default function TrackingActive() {
  const navigate = useNavigate();
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isPaused]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-surface-white">
      {/* 배경 이미지 영역 (추후 코스/지도 이미지로 교체) */}
      <div className="absolute inset-0 z-0 bg-gray-400" />

      <div className="absolute bottom-[109px] left-1/2 z-20 flex w-[319px] -translate-x-1/2 flex-col gap-[23px]">
        {/* 거리 / 페이스 통계 */}
        <div className="flex gap-[19px]">
          <StatCard value="6" unit="km/h" label="페이스" />
          <StatCard value="3.54" unit="km" label="거리" />
        </div>

        {/* 러닝 시간 + 컨트롤 */}
        <div className="flex h-[82px] items-center justify-between gap-2 rounded-[10px] bg-surface-white px-6 py-[15px] shadow-[0px_4px_10px_rgba(0,0,0,0.25)]">
          <div className="flex shrink-0 flex-col whitespace-nowrap">
            <span className={`text-black ${textStyles['number-medium']}`}>
              {formatElapsed(elapsedSec)}
            </span>
            <span className={`text-gray-500 ${textStyles['body-small-med']}`}>
              {isPaused ? '일시정지됨' : '동안 러닝 중 ···'}
            </span>
          </div>
          <div className="flex w-[108px] shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label={isPaused ? '러닝 재개' : '일시정지'}
              onClick={() => setIsPaused((prev) => !prev)}
              className="grid size-12 place-items-center rounded-[10px] bg-gray-500/70 text-white transition-transform active:scale-95"
            >
              <span className="block size-[30px]">
                {isPaused ? <PlayIcon /> : <PauseIcon />}
              </span>
            </button>
            <button
              type="button"
              aria-label="러닝 종료"
              onClick={() => navigate('/tracking/done')}
              className="grid size-12 place-items-center rounded-[10px] bg-primary/70 text-white transition-transform active:scale-95"
            >
              <span className="block size-7">
                <GoEndIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
