import { useNavigate } from 'react-router-dom';
import { textStyles } from '@/styles/tokens';
import { BackIcon } from '@/components/common/Icon/BackIcon';

interface HeaderBackProps {
  title: string;
  onBack?: () => void;
}

export function HeaderBack({ title, onBack }: HeaderBackProps) {
  const navigate = useNavigate();
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
      <h1 className={`${textStyles['heading-h2']} text-black`}>{title}</h1>
    </header>
  );
}
