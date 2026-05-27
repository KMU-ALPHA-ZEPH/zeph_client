import { SVGProps } from 'react';

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-full" {...props}>
      <rect
        x="6.5"
        y="4.5"
        width="3.5"
        height="15"
        rx="1.2"
        fill="currentColor"
      />
      <rect
        x="14"
        y="4.5"
        width="3.5"
        height="15"
        rx="1.2"
        fill="currentColor"
      />
    </svg>
  );
}
