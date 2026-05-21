import { SVGProps } from 'react';

export function LocationPinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-full" {...props}>
      <path
        d="M12 1.5C7.5 1.5 4 5 4 9.5C4 15.5 12 22.5 12 22.5C12 22.5 20 15.5 20 9.5C20 5 16.5 1.5 12 1.5Z"
        fill="currentColor"
      />
      <circle cx="12" cy="9.5" r="2.5" fill="white" />
    </svg>
  );
}
