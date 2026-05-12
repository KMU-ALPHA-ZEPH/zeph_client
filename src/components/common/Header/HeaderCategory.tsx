import { useNavigate } from 'react-router-dom';
import { textStyles } from '@/styles/tokens';

interface HeaderCategoryProps {
  title: string;
}

export function HeaderCategory({ title }: HeaderCategoryProps) {
  const navigate = useNavigate();

  return (
    <header className="flex h-[60px] w-full items-center justify-between px-3">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="뒤로 가기"
        className="flex size-7 items-center justify-center text-black"
      >
        <BackIcon />
      </button>
      <p className={`${textStyles['body-large']} text-black`}>{title}</p>
      <div className="size-7" aria-hidden />
    </header>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="size-full">
      <path
        d="M17.5 6L9.5 14L17.5 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
