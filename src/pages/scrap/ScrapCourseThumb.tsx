import HeartIcon from '@/assets/icons/mynaui_heart-solid.svg?react';
import ZephIcon from '@/assets/icons/zeph.svg?react';

type LatLng = { lat: number; lng: number };

export type ScrapCourseItem = {
  id: string;
  name: string;
  description?: string;
  region?: string;
  imageUrl?: string;
  coursePath?: LatLng[];
  isBookmarked?: boolean;
};

/** ScrapCourseThumb 썸네일용 SVG polyline. 상단 북마크/지역 라벨과 겹치지 않게 위쪽을 비워둔다. */
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
  // y 는 30 ~ 95 범위에 그려서 상단 30% 영역(=북마크/지역 라벨)을 비운다.
  const points = path
    .map((p) => {
      const x = ((p.lng - minLng) / lngRange) * 100;
      const y = 95 - ((p.lat - minLat) / latRange) * 65;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg
      viewBox="-10 -10 120 120"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full text-black"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Props = {
  data: ScrapCourseItem;
  onClick?: () => void;
  onBookmarkToggle?: () => void;
  iconType?: 'bookmark' | 'heart';
};

export default function ScrapCourseThumb({
  data,
  onClick,
  onBookmarkToggle,
  iconType = 'bookmark',
}: Props) {
  const {
    name,
    description,
    region,
    imageUrl,
    coursePath,
    isBookmarked = true,
  } = data;
  const isHeart = iconType === 'heart';
  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className="flex h-[184px] w-[108px] flex-col gap-1 text-left"
    >
      <div className="relative h-[130px] w-[108px] overflow-hidden rounded-[5px] bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : coursePath && coursePath.length > 0 ? (
          <CoursePathThumb path={coursePath} />
        ) : (
          <ZephIcon className="h-full w-full" />
        )}
        {region && (
          <p className="absolute left-1.5 top-1.5 z-10 whitespace-pre-line text-[10px] font-normal leading-tight text-text-primary">
            {region}
          </p>
        )}
        {onBookmarkToggle && (
          <button
            type="button"
            aria-label={
              isHeart
                ? isBookmarked
                  ? '좋아요 해제'
                  : '좋아요'
                : isBookmarked
                  ? '북마크 해제'
                  : '북마크'
            }
            aria-pressed={isBookmarked}
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle();
            }}
            className={`absolute right-2 top-1.5 z-10 grid h-[23px] w-[23px] place-items-center ${
              isHeart
                ? isBookmarked
                  ? 'text-[#FF5C5C]'
                  : 'text-gray-500'
                : isBookmarked
                  ? 'text-primary'
                  : 'text-gray-500'
            }`}
          >
            {isHeart ? (
              <HeartIcon className="size-[18px]" />
            ) : (
              <svg
                width="13"
                height="19"
                viewBox="0 0 13 19"
                fill={isBookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.2"
                aria-hidden="true"
              >
                <path d="M0.5 0.5H12.5V18.5L6.5 14.75L0.5 18.5V0.5Z" />
              </svg>
            )}
          </button>
        )}
        {!onBookmarkToggle && isBookmarked && (
          <span
            className={`absolute right-2 top-1.5 z-10 grid h-[23px] w-[23px] place-items-center ${
              isHeart ? 'text-[#FF5C5C]' : 'text-primary'
            }`}
          >
            {isHeart ? (
              <HeartIcon className="size-[18px]" />
            ) : (
              <svg
                width="13"
                height="19"
                viewBox="0 0 13 19"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M0 0H13V19L6.5 14.75L0 19V0Z" />
              </svg>
            )}
          </span>
        )}
      </div>
      <p className="truncate text-body-md text-text-primary">{name}</p>
      <p className="-mt-1 line-clamp-1 text-[10px] text-gray-500">
        {description ?? ''}
      </p>
    </div>
  );
}
