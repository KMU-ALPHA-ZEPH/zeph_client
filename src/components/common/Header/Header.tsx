import { useNavigate } from 'react-router-dom';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import { MenuIcon } from '@/components/common/Icon/MenuIcon';
import { textStyles } from '@/styles/tokens';

export type HeaderVariant = 'title' | 'back';

interface HeaderProps {
  variant?: HeaderVariant;
  title?: string;
  onBack?: () => void;
  onMenuClick?: () => void;
}

export default function Header({
  variant = 'title',
  title,
  onBack,
  onMenuClick,
}: HeaderProps) {
  const navigate = useNavigate();

  if (variant === 'back') {
    const handleBack = onBack ?? (() => navigate(-1));
    return (
      <header className="flex h-[60px] w-full items-center gap-3 px-3">
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로 가기"
          className="flex size-7 items-center justify-center text-black"
        >
          <BackIcon className="size-6 text-black" />
        </button>
        {title && (
          <h1 className={`${textStyles['heading-h2']} text-black`}>{title}</h1>
        )}
      </header>
    );
  }

  return (
    <header className="flex h-[60px] w-full items-center justify-between px-6">
      {title && (
        <h1 className={`${textStyles['heading-h1']} text-black`}>{title}</h1>
      )}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="메뉴 열기"
        className="ml-auto flex size-6 items-center justify-center text-black"
      >
        <MenuIcon />
      </button>
    </header>
  );
}
