import ZephIcon from '@/assets/icons/zeph.svg?react';

export type ScrapCourseItem = {
  id: string;
  name: string;
  date: string;
  region?: string;
  imageUrl?: string;
  isBookmarked?: boolean;
};

type Props = {
  data: ScrapCourseItem;
  onClick?: () => void;
  onBookmarkToggle?: () => void;
};

export default function ScrapCourseThumb({
  data,
  onClick,
  onBookmarkToggle,
}: Props) {
  const { name, date, region, imageUrl, isBookmarked = true } = data;
  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className="flex h-[184px] w-[108px] flex-col gap-1 text-left"
    >
      <div className="relative h-[130px] w-[108px] overflow-hidden rounded-[5px] bg-gray-300">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <ZephIcon className="h-full w-full" />
        )}
        {region && (
          <p className="absolute left-1.5 top-1.5 whitespace-pre-line text-[10px] font-normal leading-tight text-text-primary">
            {region}
          </p>
        )}
        {onBookmarkToggle && (
          <button
            type="button"
            aria-label={isBookmarked ? '북마크 해제' : '북마크'}
            aria-pressed={isBookmarked}
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle();
            }}
            className={`absolute right-2 top-1.5 grid h-[23px] w-[23px] place-items-center ${
              isBookmarked ? 'text-primary' : 'text-gray-500'
            }`}
          >
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
          </button>
        )}
        {!onBookmarkToggle && isBookmarked && (
          <span className="absolute right-2 top-1.5 grid h-[23px] w-[23px] place-items-center text-primary">
            <svg
              width="13"
              height="19"
              viewBox="0 0 13 19"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M0 0H13V19L6.5 14.75L0 19V0Z" />
            </svg>
          </span>
        )}
      </div>
      <p className="text-body-md text-text-primary">{name}</p>
      <p className="-mt-1 text-[10px] text-gray-500">{date}</p>
    </div>
  );
}
