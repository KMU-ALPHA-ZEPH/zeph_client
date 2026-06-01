import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import backgroundImage from '@/assets/backgroundImage.png';
import { Button } from '@/components/common/Button';
import { textStyles } from '@/styles/tokens';
import ResetPasswordModal from './ResetPasswordModal';

/**
 * 비밀번호 재설정 메일의 링크가 도착하는 페이지.
 * URL 의 ?token= 값을 읽어 ResetPasswordModal 에 넘긴다.
 * 예) https://<앱주소>/reset-password?token=xxxxx
 */
export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();

  const goLogin = () => navigate('/login', { replace: true });

  return (
    <div className="relative mx-auto h-dvh w-full max-w-md overflow-hidden bg-black">
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      {token ? (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 50, stiffness: 280 }}
          className="absolute inset-x-0 bottom-0 top-[52px] z-50"
        >
          <ResetPasswordModal
            token={token}
            onClose={goLogin}
            onDone={goLogin}
          />
        </motion.div>
      ) : (
        <div className="relative flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
          <p className={`${textStyles['body-medium']} text-white`}>
            유효하지 않은 접근이에요.
            <br />
            비밀번호 재설정 메일의 링크로 다시 접속해주세요.
          </p>
          <Button type="button" onClick={goLogin}>
            로그인으로 가기
          </Button>
        </div>
      )}
    </div>
  );
}
