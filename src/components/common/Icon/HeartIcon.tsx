import { SVGProps } from 'react';

export function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-full" {...props}>
      <path
        d="M12 20.5S3.5 15 3.5 8.8C3.5 5.9 5.8 3.7 8.5 3.7C10.1 3.7 11.4 4.5 12 5.6C12.6 4.5 13.9 3.7 15.5 3.7C18.2 3.7 20.5 5.9 20.5 8.8C20.5 15 12 20.5 12 20.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
