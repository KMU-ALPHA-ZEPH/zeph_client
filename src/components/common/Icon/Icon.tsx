import type { ComponentType, SVGProps } from 'react';

export type IconSize = 'sm' | 'lg';

const SIZE_MAP: Record<IconSize, number> = {
  sm: 100,
  lg: 150,
};

export type SVGIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface IconProps
  extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  as: SVGIconComponent;
  size?: IconSize;
}

export const Icon = ({ as: Component, size = 'sm', ...rest }: IconProps) => {
  const px = SIZE_MAP[size];
  return <Component width={px} height={px} {...rest} />;
};
