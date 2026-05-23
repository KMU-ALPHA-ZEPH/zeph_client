import type { SVGProps } from 'react';

export function CategoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-full" {...props}>
      <path
        d="M5 4L8 9H2L5 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect
        x="11"
        y="3"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="5" cy="14" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
