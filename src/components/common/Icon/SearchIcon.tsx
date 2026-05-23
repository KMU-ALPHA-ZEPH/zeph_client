import { SVGProps } from 'react';

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className="size-full" {...props}>
      <circle
        cx="7.5"
        cy="7.5"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 12L16.5 16.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
