import { SVGProps } from 'react';

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-full" {...props}>
      <path d="M7 5L19 12L7 19V5Z" fill="currentColor" />
    </svg>
  );
}
