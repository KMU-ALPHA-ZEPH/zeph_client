import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NEXT_PATH = '/course/main';
const SPLASH_DURATION_MS = 1200;

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(NEXT_PATH, { replace: true });
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative mx-auto h-dvh w-full max-w-md overflow-hidden bg-primary" />
  );
}
