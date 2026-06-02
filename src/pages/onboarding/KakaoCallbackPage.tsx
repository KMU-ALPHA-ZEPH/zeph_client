import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUser, saveAuth, saveUser } from '@/lib/auth';
import { getProfile, loginWithKakaoCode } from '@/apis/auth';

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

    const run = async () => {
      try {
        const code = params.get('code');
        if (code) {
          // 권장 흐름: 인증 코드를 백엔드와 교환해 토큰 + 카카오 프로필 획득
          const auth = await loginWithKakaoCode(code);
          saveAuth(auth);
        } else {
          // fallback: 백엔드가 쿼리로 사용자 정보/토큰을 직접 넘겨주는 경우
          const token = params.get('token') ?? params.get('accessToken');
          if (token) localStorage.setItem('accessToken', token);
          const name = params.get('name');
          const email = params.get('email');
          const id = params.get('id');
          if (name || email || id || token) {
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
        }

        // 저장된 토큰에서 얻은 id로 DB의 정확한 이름/이메일을 보강
        const uid = getUser()?.id;
        if (uid != null) {
          try {
            const p = await getProfile(uid);
            saveUser({
              id: p.id,
              name: p.name,
              email: p.email,
              profile_image_url: p.profile_image_url,
              kakaoid: p.kakaoId,
            });
          } catch {
            // 프로필 조회 실패해도 로그인 자체는 진행
          }
        }

        navigate('/splash', { replace: true });
      } catch (e) {
        console.error('[KakaoCallback] 로그인 처리 실패:', e);
        setError('카카오 로그인 처리에 실패했습니다.');
      }
    };

    void run();
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
