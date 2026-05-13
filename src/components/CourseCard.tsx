export type Course = {
  rank?: number;
  city: string;
  district: string;
  distance: number;
  description: string;
  imageUrl?: string;
  isBookmarked?: boolean;
};

type Props = {
  course: Course;
  onClick?: () => void;
};

export default function CourseCard({ course, onClick }: Props) {
  const { city, district, distance, description, imageUrl } = course;

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
              {distance} km
            </span>
            <span className="text-body-md font-normal text-gray-500">
              {city} {district}
            </span>
          </div>
          <p className="text-body-sm font-normal text-gray-500">
            {description}
          </p>
        </div>

        <ChevronRightIcon />
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="7"
      height="13"
      viewBox="0 0 7 13"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 1L6 6.5L1 12"
        stroke="#8D8D8D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
