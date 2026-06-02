import ZephIcon from '@/assets/icons/zeph.svg?react';

type LatLng = { lat: number; lng: number };

export type Course = {
  rank?: number;
  name: string;
  distance: number;
  description: string;
  imageUrl?: string;
  /** 작은 미니맵으로 표시할 코스 좌표 배열 */
  coursePath?: LatLng[];
  isBookmarked?: boolean;
  lat?: number;
  lng?: number;
  roundTrip?: boolean;
};

type Props = {
  course: Course;
  onClick?: () => void;
};

/** 좌표 배열을 카드 썸네일 크기에 맞춰 SVG polyline 으로 그린다. */
function CoursePathThumb({ path }: { path: LatLng[] }) {
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

export default function CourseCard({ course, onClick }: Props) {
  const { name, distance, description, imageUrl, coursePath } = course;

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className="flex h-[70px] w-full max-w-[350px] cursor-pointer items-center gap-3 rounded-[10px] bg-surface-white px-[13px] py-[11px] shadow-[0px_2px_6px_rgba(0,0,0,0.10)]"
    >
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-[5px] bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : coursePath && coursePath.length > 0 ? (
          <CoursePathThumb path={coursePath} />
        ) : (
          <ZephIcon className="h-full w-full" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between self-stretch gap-2">
        <div className="flex min-w-0 flex-col items-start gap-[0.5px]">
          <div className="flex w-full items-center gap-[5px]">
            <span className="truncate text-body-md font-normal text-text-primary">
              {name}
            </span>
            {distance > 0 && (
              <span className="shrink-0 text-body-md font-normal text-gray-500">
                {Math.round(distance)} km
              </span>
            )}
          </div>
          {description && (
            <p className="line-clamp-1 w-full text-body-sm font-normal text-gray-500">
              {description}
            </p>
          )}
        </div>

        <ChevronRightIcon className="size-[13px] flex-shrink-0 text-gray-500" />
      </div>
    </div>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 8 14" fill="none" {...props}>
      <path
        d="M1 1L7 7L1 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
