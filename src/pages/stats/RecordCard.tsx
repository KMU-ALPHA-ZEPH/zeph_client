import { formatDuration, formatPace, formatRecordDate } from '@/utils/format';
import ZephIcon from '@/assets/icons/zeph.svg?react';

type CoursePathPoint = { lat: number; lng: number };

export type RecordCardData = {
  courseName: string;
  date: Date | string;
  distanceKm: number;
  durationSec: number;
  avgPace: number;
  coursePath: CoursePathPoint[];
  imageUrl?: string;
};

type Props = {
  data: RecordCardData;
  onClick?: () => void;
};

/** RecordCard 썸네일용 SVG polyline. 인기 코스 카드와 동일한 스타일. */
function CoursePathThumb({ path }: { path: CoursePathPoint[] }) {
  if (path.length < 2) return <ZephIcon className="h-full w-full" />;
  const lats = path.map((p) => p.lat);
  const lngs = path.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 1e-9;
  const lngRange = maxLng - minLng || 1e-9;
  const points = path
    .map((p) => {
      const x = ((p.lng - minLng) / lngRange) * 100;
      const y = 100 - ((p.lat - minLat) / latRange) * 100;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg
      viewBox="-10 -10 120 120"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full text-primary"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function RecordCard({ data, onClick }: Props) {
  const {
    courseName,
    date,
    distanceKm,
    durationSec,
    avgPace,
    imageUrl,
    coursePath,
  } = data;
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className="flex w-full max-w-[350px] flex-col gap-3 rounded-[10px] bg-surface-white p-[14px] shadow-[0px_2px_4px_rgba(0,0,0,0.10)]"
    >
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-[5px] bg-gray-100">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : coursePath && coursePath.length > 0 ? (
            <CoursePathThumb path={coursePath} />
          ) : (
            <ZephIcon className="h-full w-full" />
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-body-md text-text-primary">{courseName}</p>
          <p className="text-body-sm text-text-secondary">
            {formatRecordDate(dateObj)}
          </p>
        </div>
      </div>

      <div className="flex items-start justify-between pr-2">
        <div className="flex flex-col gap-1">
          <span className="text-body-md text-text-primary">
            {distanceKm.toFixed(2)}
          </span>
          <span className="text-caption leading-4 text-text-secondary">km</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-body-md text-text-primary">
            {formatPace(avgPace)}
          </span>
          <span className="text-caption leading-4 text-text-secondary">
            평균 페이스
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-body-md text-text-primary">
            {formatDuration(durationSec)}
          </span>
          <span className="text-caption leading-4 text-text-secondary">
            시간
          </span>
        </div>
      </div>
    </div>
  );
}
