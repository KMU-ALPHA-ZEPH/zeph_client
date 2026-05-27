import { LocationIcon } from '@/components/common/Icon/LocationIcon';
import { textStyles } from '@/styles/tokens';

interface GpsBadgeProps {
  on?: boolean;
  className?: string;
}

export function GpsBadge({ on = true, className = '' }: GpsBadgeProps) {
  const tone = on
    ? 'border-primary text-primary'
    : 'border-gray-500 text-gray-500';

  return (
    <div
      className={`inline-flex items-center gap-[5px] rounded-[10px] border px-[7px] py-1.5 ${tone} ${className}`}
    >
      <span className="flex items-center gap-[3px]">
        <span className="block size-4">
          <LocationIcon />
        </span>
        <span className={textStyles['body-small-med']}>GPS</span>
      </span>
      <span className={textStyles['body-small-med']}>{on ? 'ON' : 'OFF'}</span>
    </div>
  );
}
