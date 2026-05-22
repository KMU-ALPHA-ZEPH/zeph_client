import type { SVGProps } from 'react';

export function BulbIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-full" {...props}>
      <path
        d="M7 14h6M8 17h4M10 3a5 5 0 00-3 9c.5.4 1 1 1 2h4c0-1 .5-1.6 1-2a5 5 0 00-3-9z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
