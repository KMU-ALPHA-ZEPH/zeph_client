import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { saveAuth, saveUser } from '@/lib/auth';
import { getMyProfile, loginWithKakaoCode } from '@/apis/auth';

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
          // fallback: 백엔드가 쿼리로 토큰/사용자 정보를 직접 넘겨주는 경우
          const token = params.get('token') ?? params.get('accessToken');
          const name = params.get('name');
          const email = params.get('email');
          const id = params.get('id');
          if (token) {
            // 토큰을 직접 받은 경우: saveAuth 가 JWT(sub)에서 id 를 디코드한다
            saveAuth({
              token,
              name: name ?? '',
              email: email ?? '',
              profile_image_url: params.get('profile_image_url') ?? undefined,
              kakaoid: params.get('kakaoid')
                ? Number(params.get('kakaoid'))
                : undefined,
            });
          } else if (name || email || id) {
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

        // 인증(쿠키/JWT) 기준으로 내 프로필을 조회해 카카오 이름/이메일을 저장
        try {
          const me = await getMyProfile();
          saveUser({
            id: me.id,
            name: me.name,
            email: me.email,
            profile_image_url: me.profile_image_url,
            kakaoid: me.kakaoId,
          });
        } catch {
          // /users/me 실패해도(쿼리 파라미터로 이미 저장됐을 수 있음) 로그인은 진행
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
