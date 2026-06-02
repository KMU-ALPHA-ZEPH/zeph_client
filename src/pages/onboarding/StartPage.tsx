import backgroundImage from '@/assets/backgroundImage.png';
import { textStyles } from '@/styles/tokens';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const NEXT_PATH = '/login';
const SPLASH_DURATION_MS = 2000;

export default function StartPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(NEXT_PATH, { replace: true });
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative mx-auto h-dvh w-full max-w-md overflow-hidden bg-black">
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative flex h-full flex-col items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="h-[100px] w-[100px]" />
        <div
          className={`-mt-1 ${textStyles['heading-h3-onboarding']} text-center text-white`}
        >
          <p>도심 속 안전한</p>
          <p>당신만의 러닝 가이드</p>
        </div>
      </div>
    </div>
  );
}
