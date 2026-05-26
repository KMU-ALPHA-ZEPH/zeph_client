import { SVGProps } from 'react';

export function GoEndIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-full" {...props}>
      <path d="M5 5L15 12L5 19V5Z" fill="currentColor" />
      <rect
        x="16.5"
        y="5"
        width="2.6"
        height="14"
        rx="1.1"
        fill="currentColor"
      />
    </svg>
  );
}
