import { SVGProps } from 'react';

export function BackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="size-full" {...props}>
      <path
        d="M17.5 6L9.5 14L17.5 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
