import { textStyles } from '@/styles/tokens';

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

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-full">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
