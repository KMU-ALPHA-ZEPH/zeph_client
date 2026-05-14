import ArrowDownIcon from '@/assets/icons/ep_arrow-down.svg?react';
import { type Period } from '@/components/common/PeriodSelector';

export type ChartDataPoint = { x: number; value: number };

type Props = {
  period: Period;
  date: Date | string;
  joinYear?: number;
  totalDistanceKm: number;
  runCount: number;
  avgPace: number;
  totalDurationSec: number;
  data: ChartDataPoint[];
  onLabelClick?: () => void;
};

const WEEK_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

function formatPace(secPerKm: number): string {
  const total = Math.max(0, Math.floor(secPerKm));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}'${String(s).padStart(2, '0')}"`;
}

function formatDuration(sec: number): string {
  const total = Math.max(0, Math.floor(sec));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function getXAxisInfo(
  period: Period,
  d: Date,
  joinYear: number,
): { xMin: number; xMax: number; labels: { x: number; text: string }[] } {
  if (period === 'week') {
    return {
      xMin: 1,
      xMax: 7,
      labels: WEEK_LABELS.map((text, i) => ({ x: i + 1, text })),
    };
  }
  if (period === 'month') {
    const max = daysInMonth(d);
    const stops = [1, 5, 10, 15, 20, 25, max];
    return {
      xMin: 1,
      xMax: max,
      labels: stops.map((day) => ({ x: day, text: String(day) })),
    };
  }
  if (period === 'year') {
    return {
      xMin: 1,
      xMax: 12,
      labels: Array.from({ length: 12 }, (_, i) => ({
        x: i + 1,
        text: `${i + 1}월`,
      })),
    };
  }
  const current = d.getFullYear();
  return {
    xMin: joinYear,
    xMax: current,
    labels: Array.from({ length: current - joinYear + 1 }, (_, i) => ({
      x: joinYear + i,
      text: String(joinYear + i),
    })),
  };
}

function computeYAxis(maxValue: number): number[] {
  const rounded = Math.max(4, Math.ceil(maxValue / 4) * 4);
  const step = rounded / 4;
  return [0, step, step * 2, step * 3, rounded];
}

function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatWeekLabel(d: Date): string {
  const dMon = startOfWeek(d);
  const nowMon = startOfWeek(new Date());
  const diffWeeks = Math.round(
    (nowMon.getTime() - dMon.getTime()) / (7 * 24 * 60 * 60 * 1000),
  );
  if (diffWeeks === 0) return '이번주';
  if (diffWeeks === 1) return '저번주';
  if (diffWeeks > 1) return `${diffWeeks}주 전`;
  if (diffWeeks === -1) return '다음주';
  return `${-diffWeeks}주 후`;
}

function formatDateLabel(d: Date, period: Period, joinYear: number): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  if (period === 'week') return formatWeekLabel(d);
  if (period === 'month') return `${y}년 ${m}월`;
  if (period === 'year') return `${y}년`;
  return `${joinYear} ~ ${y}`;
}

function getBarWidth(period: Period): number {
  if (period === 'week') return 10;
  if (period === 'year') return 8;
  if (period === 'all') return 14;
  return 4;
}

export default function StatsChart({
  period,
  date,
  joinYear = 2024,
  totalDistanceKm,
  runCount,
  avgPace,
  totalDurationSec,
  data,
  onLabelClick,
}: Props) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const { xMin, xMax, labels } = getXAxisInfo(period, dateObj, joinYear);
  const maxValue = data.reduce((acc, d) => Math.max(acc, d.value), 0);
  const yAxis = computeYAxis(maxValue);
  const yMax = yAxis[yAxis.length - 1];
  const xRange = xMax - xMin || 1;
  const barWidth = getBarWidth(period);

  return (
    <div className="flex w-full max-w-[350px] flex-col gap-3">
      <button
        type="button"
        onClick={onLabelClick}
        className="flex items-center gap-1 text-text-primary"
      >
        <span className="text-body-sm">
          {formatDateLabel(dateObj, period, joinYear)}
        </span>
        <ArrowDownIcon className="size-3" />
      </button>

      <div className="relative h-[320px] w-full overflow-hidden rounded-t-[10px] bg-surface-white px-4 pb-8 pt-2">
        <div className="leading-[60px]">
          <span className="text-[50px] font-normal text-text-primary">
            {totalDistanceKm.toFixed(1)}{' '}
          </span>
          <span className="text-[50px] font-normal text-gray-500">km</span>
        </div>

        <div className="mt-2 flex items-start gap-3">
          <div className="flex flex-col">
            <span className="text-h2 font-bold text-text-primary">
              {runCount}
            </span>
            <span className="text-body-md font-medium text-gray-500">러닝</span>
          </div>
          <div className="flex flex-col">
            <span className="text-h2 font-bold text-text-primary">
              {formatPace(avgPace)}
            </span>
            <span className="text-body-md font-medium text-gray-500">
              평균 페이스
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-h2 font-bold text-text-primary">
              {formatDuration(totalDurationSec)}
            </span>
            <span className="text-body-md font-medium text-gray-500">시간</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 right-9 top-[180px]">
          <div className="relative h-full w-full">
            {yAxis.map((v, i) => (
              <div
                key={v}
                className="absolute inset-x-0 border-t border-gray-400/60"
                style={{ top: `${100 - (i / (yAxis.length - 1)) * 100}%` }}
              />
            ))}

            {data.map((d, idx) => {
              const leftPercent = ((d.x - xMin) / xRange) * 100;
              const heightPercent = yMax > 0 ? (d.value / yMax) * 100 : 0;
              return (
                <div
                  key={`${d.x}-${idx}`}
                  className="absolute bottom-0 rounded-t-[5px] bg-primary"
                  style={{
                    left: `calc(${leftPercent}% - ${barWidth / 2}px)`,
                    width: `${barWidth}px`,
                    height: `${heightPercent}%`,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-2 left-6 right-9 h-3">
          {labels.map((l) => (
            <span
              key={l.x}
              className="absolute -translate-x-1/2 text-[10px] text-text-secondary"
              style={{ left: `${((l.x - xMin) / xRange) * 100}%` }}
            >
              {l.text}
            </span>
          ))}
        </div>

        <div className="absolute bottom-8 right-0 top-[180px] w-7">
          {yAxis.map((v, i) => {
            const topPercent = 100 - (i / (yAxis.length - 1)) * 100;
            return (
              <span
                key={v}
                className="absolute right-1 -translate-y-1/2 text-[10px] text-text-secondary"
                style={{ top: `${topPercent}%` }}
              >
                {v === 0 ? '0km' : v}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
