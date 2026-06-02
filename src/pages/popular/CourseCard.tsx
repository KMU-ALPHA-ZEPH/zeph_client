import ZephIcon from '@/assets/icons/zeph.svg?react';

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
};

export default function CourseCard({ course, onClick }: Props) {
  const { city, district, distance, description, imageUrl } = course;
  const region = [city, district].filter(Boolean).join(' ');

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className="flex h-[70px] w-full max-w-[350px] cursor-pointer items-center gap-3 rounded-[10px] bg-surface-white px-[13px] py-[11px] shadow-[0px_2px_6px_rgba(0,0,0,0.10)]"
    >
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-[5px] bg-gray-300">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <ZephIcon className="h-full w-full" />
        )}
      </div>

      <div className="flex flex-1 items-center justify-between self-stretch">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-[5px]">
            {distance > 0 && (
              <span className="text-body-md font-normal text-text-primary">
                {distance} km
              </span>
            )}
            {region && (
              <span className="text-body-md font-normal text-gray-500">
                {region}
              </span>
            )}
          </div>
          {description && (
            <p className="line-clamp-1 w-[116px] text-body-sm font-normal text-gray-500">
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
