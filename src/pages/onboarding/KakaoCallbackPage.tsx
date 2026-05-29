import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { saveUser } from '@/lib/auth';

export default function KakaoCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    if (params.get('error')) {
      setError('카카오 로그인이 취소되었거나 실패했습니다.');
      return;
    }

    const name = params.get('name');
    const email = params.get('email');
    const id = params.get('id');
    if (name || email || id) {
      saveUser({
        id: id ? Number(id) : undefined,
        name: name ?? '',
        email: email ?? '',
        profile_image_url: params.get('profile_image_url') ?? undefined,
        kakaoid: params.get('kakaoid')
          ? Number(params.get('kakaoid'))
          : undefined,
      });
    }

    navigate('/splash', { replace: true });
  }, [params, navigate]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 px-5 text-center">
      {error ? (
        <>
          <p className="text-body-md text-text-primary">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/login', { replace: true })}
            className="text-body-sm text-primary"
          >
            로그인 페이지로 돌아가기
          </button>
        </>
      ) : (
        <p className="text-body-md text-text-secondary">로그인 처리 중...</p>
      )}
    </div>
  );
}
