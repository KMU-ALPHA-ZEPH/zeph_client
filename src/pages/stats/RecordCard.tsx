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

export default function RecordCard({ data, onClick }: Props) {
  const { courseName, date, distanceKm, durationSec, avgPace, imageUrl } = data;
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className="flex w-full max-w-[350px] flex-col gap-3 rounded-[10px] bg-surface-white p-[14px] shadow-[0px_2px_4px_rgba(0,0,0,0.10)]"
    >
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-[5px] bg-gray-400">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
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
