import type { SVGProps } from 'react';

export function InfinityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-full" {...props}>
      <path
        d="M5.5 13c-1.5 0-3-1.34-3-3s1.5-3 3-3c1.5 0 2.5 1 3.5 2l2 2c1 1 2 2 3.5 2s3-1.34 3-3-1.5-3-3-3c-1.5 0-2.5 1-3.5 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
