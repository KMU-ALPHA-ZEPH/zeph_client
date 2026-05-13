import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ZephIcon from '@/assets/icons/zeph.svg?react';
import { Icon } from '@/components/common/Icon';

const NEXT_PATH = '/start';
const SPLASH_DURATION_MS = 1000;

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(NEXT_PATH, { replace: true });
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-primary">
      <Icon as={ZephIcon} size="lg" />
    </div>
  );
}
