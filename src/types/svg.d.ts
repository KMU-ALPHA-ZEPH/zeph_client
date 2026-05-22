declare module '*.svg' {
  const src: string; // Vite: url import
  export default src;
}

declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react';
  const ReactComponent: FC<SVGProps<SVGSVGElement> & { title?: string }>;
  export default ReactComponent;
}

declare module '*.svg?url' {
  const src: string;
  export default src;
}
