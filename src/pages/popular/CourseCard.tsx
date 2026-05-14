import BookmarkIcon from '@/assets/icons/circum_bookmark.svg?react';
import BookmarkFilledIcon from '@/assets/icons/circum_bookmark_filled.svg?react';

export type Course = {
  rank?: number;
  city: string;
  district: string;
  distance: number;
  description: string;
  imageUrl?: string;
  isBookmarked?: boolean;
  lat?: number;
  lng?: number;
  roundTrip?: boolean;
};

type Props = {
  course: Course;
  onClick?: () => void;
  onBookmarkToggle?: () => void;
};

export default function CourseCard({
  course,
  onClick,
  onBookmarkToggle,
}: Props) {
  const { city, district, distance, description, imageUrl, isBookmarked } =
    course;

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className="flex h-[70px] w-full max-w-[350px] items-center gap-3 rounded-[10px] bg-surface-white px-[13px] py-[11px] shadow-[0px_2px_6px_rgba(0,0,0,0.10)]"
    >
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-[5px] bg-gray-300">
        {imageUrl && (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="flex flex-1 items-center justify-between self-stretch">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-[5px]">
            <span className="text-body-md font-normal text-text-primary">
              {city} {district}
            </span>
            <span className="text-body-md font-normal text-gray-500">
              - {distance} km
            </span>
          </div>
          <p className="text-body-sm font-normal text-gray-500">
            {description}
          </p>
        </div>

        <button
          type="button"
          aria-label={isBookmarked ? '북마크 해제' : '북마크'}
          aria-pressed={!!isBookmarked}
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle?.();
          }}
          className={`-mr-2 grid h-11 w-11 place-items-center ${
            isBookmarked ? 'text-primary' : 'text-gray-500'
          }`}
        >
          {isBookmarked ? <BookmarkFilledIcon /> : <BookmarkIcon />}
        </button>
      </div>
    </div>
  );
}
