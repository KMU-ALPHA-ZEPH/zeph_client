import type { SVGProps } from 'react';

export function AIIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-full" {...props}>
      <path
        d="M10 2.5L11.6 6.4L15.5 8L11.6 9.6L10 13.5L8.4 9.6L4.5 8L8.4 6.4L10 2.5Z"
        fill="currentColor"
      />
      <path
        d="M15.5 13L16.3 14.7L18 15.5L16.3 16.3L15.5 18L14.7 16.3L13 15.5L14.7 14.7L15.5 13Z"
        fill="currentColor"
      />
    </svg>
  );
}
