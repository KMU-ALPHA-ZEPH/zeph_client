import { textStyles } from '@/styles/tokens';
import { MenuIcon } from '@/components/common/Icon/MenuIcon';

interface HeaderTitleProps {
  title: string;
  onMenuClick?: () => void;
}

export function HeaderTitle({ title, onMenuClick }: HeaderTitleProps) {
  return (
    <header className="flex h-[60px] w-full items-center justify-between px-6">
      <h1 className={`${textStyles['heading-h1']} text-black`}>{title}</h1>
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="메뉴 열기"
        className="flex size-6 items-center justify-center text-black"
      >
        <MenuIcon />
      </button>
    </header>
  );
}
