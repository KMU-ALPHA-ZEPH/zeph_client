import { textStyles } from '@/styles/tokens';

export type Course = {
  rank: number;
  city: string;
  district: string;
  distance: number;
  description: string;
  imageUrl?: string;
  isBookmarked?: boolean;
};

type Props = {
  course: Course;
  onBookmarkToggle?: () => void;
};

export default function CourseCard({ course, onBookmarkToggle }: Props) {
  const {
    rank,
    city,
    district,
    distance,
    description,
    imageUrl,
    isBookmarked,
  } = course;

  return (
    <div className="flex h-48 w-full max-w-[350px] flex-col overflow-hidden rounded-[5px] bg-surface-white shadow-[0px_2px_6px_rgba(0,0,0,0.10)]">
      <div
        className="relative h-[140px] w-full bg-gray-300 bg-cover bg-center"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      >
        <div className="absolute inset-x-0 top-2 flex items-center justify-between px-5">
          <div className="leading-tight">
            <p className="text-body-lg font-semibold text-text-primary">
              {city}
            </p>
            <p className="text-body-sm font-semibold text-text-primary">
              {district}
            </p>
          </div>
          <button
            type="button"
            aria-label={isBookmarked ? '북마크 해제' : '북마크'}
            aria-pressed={!!isBookmarked}
            onClick={onBookmarkToggle}
            className="grid h-11 place-items-center"
          >
            <BookmarkIcon active={!!isBookmarked} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between px-3">
        <span className="font-['Potta_One'] text-number-md leading-none text-text-primary">
          {rank}
        </span>
        <div className="flex flex-col items-end gap-1">
          <p className="text-right">
            <span className="text-h3 font-semibold text-text-primary">
              {distance}
            </span>
            <span className="text-body-sm font-semibold text-text-primary">
              {' '}
              km
            </span>
          </p>
          <p
            className={`${textStyles['body-small']} font-semibold text-text-secondary`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="26"
      viewBox="0 0 13 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1 1H12V18L6.5 14.75L1 18V1Z"
        fill={active ? 'var(--color-primary)' : 'none'}
        stroke={active ? 'var(--color-primary)' : 'var(--color-gray-500)'}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
