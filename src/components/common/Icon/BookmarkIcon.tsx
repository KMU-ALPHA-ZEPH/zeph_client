import { SVGProps } from 'react';

export function BookmarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-full" {...props}>
      <path
        d="M6 3.5H18C18.55 3.5 19 3.95 19 4.5V20.5L12 16.3L5 20.5V4.5C5 3.95 5.45 3.5 6 3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
