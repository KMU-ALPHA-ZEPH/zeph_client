import type { SVGProps } from 'react';

export function ArrowBothIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-full" {...props}>
      <path
        d="M3 10H17M3 10L6 7M3 10L6 13M17 10L14 7M17 10L14 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
