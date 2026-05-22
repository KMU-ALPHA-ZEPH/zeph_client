import { useNavigate } from 'react-router-dom';
import { textStyles } from '@/styles/tokens';
import { BackIcon } from '@/components/common/Icon/BackIcon';

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
        <BackIcon className="size-6 text-black" />
      </button>
      <p className={`${textStyles['body-large']} text-black`}>{title}</p>
      <div className="size-7" aria-hidden />
    </header>
  );
}
