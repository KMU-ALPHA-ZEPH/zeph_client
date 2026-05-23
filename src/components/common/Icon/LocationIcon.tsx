import { SVGProps } from 'react';

export function LocationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="size-full" {...props}>
      <circle
        cx="14"
        cy="14"
        r="10.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="14" cy="14" r="3" fill="currentColor" />
      <path
        d="M14 1.5V5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 23V26.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M1.5 14H5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M23 14H26.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
