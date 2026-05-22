import HeartIcon from '@/assets/icons/mynaui_heart-solid.svg?react';
import ZephIcon from '@/assets/icons/zeph.svg?react';
import PinIcon from '@/assets/icons/cuida_pin-fill.svg?react';

export type ScrapCardData = {
  id: string;
  title: string;
  count?: number;
  description?: string;
  imageUrl?: string;
  iconType?: 'heart';
  isPinned?: boolean;
};

type Props = {
  data: ScrapCardData;
  onClick?: () => void;
};

export default function ScrapCard({ data, onClick }: Props) {
  const { title, count, description, imageUrl, iconType, isPinned } = data;
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-[74px] w-full items-center gap-3 rounded-[10px] bg-surface-white px-[13px] text-left shadow-[0px_2px_6px_rgba(0,0,0,0.10)]"
    >
      <div className="grid h-12 w-12 flex-shrink-0 place-items-center overflow-hidden rounded-[5px] bg-gray-300">
        {iconType === 'heart' ? (
          <HeartIcon className="size-6" />
        ) : imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <ZephIcon className="h-full w-full" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-[5px]">
          <span className="text-body-md font-normal text-text-primary">
            {title}
          </span>
          {count !== undefined && (
            <span className="text-body-md font-normal text-gray-500">
              {count}
            </span>
          )}
          {isPinned && <PinIcon className="size-[14px]" />}
        </div>
        {description && (
          <p className="text-body-sm font-normal leading-4 text-text-secondary">
            {description}
          </p>
        )}
      </div>

      <svg
        width="7"
        height="13"
        viewBox="0 0 7 13"
        fill="none"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <path
          d="M1 1L6 6.5L1 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
