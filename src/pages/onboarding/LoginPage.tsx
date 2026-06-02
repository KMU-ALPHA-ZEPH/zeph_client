import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { InputBox } from '@/components/common/InputBox';
import { Button } from '@/components/common/Button';
import backgroundImage from '@/assets/backgroundImage.png';
import kakaoIcon from '@/assets/icons/kakao-talk.png';
import { textStyles } from '@/styles/tokens';
import { login } from '@/apis/auth';
import { saveAuth } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/axios';
import SignupModal from './SignupModal';
import ForgotPasswordModal from './ForgotPasswordModal';

const KAKAO_AUTH_URL = `${API_BASE_URL}/oauth2/authorization/kakao`;

export default function LoginPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력하세요.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const auth = await login({ email: email.trim(), password });
      saveAuth(auth);
      navigate('/splash', { replace: true });
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.status === 401
          ? '이메일 또는 비밀번호가 올바르지 않습니다.'
          : '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="relative mx-auto h-dvh w-full max-w-md overflow-hidden bg-black">
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative flex h-full flex-col pb-22">
        <div className="flex flex-1 items-center justify-center">
          <div className="h-[100px] w-[100px]" />
        </div>

        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: [0.4, 0, 0.2, 1] }}
          className="flex w-full flex-col items-center gap-3 px-8"
        >
          <InputBox
            strokeNone
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full"
          />
          <InputBox
            strokeNone
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full"
          />
          {error && (
            <p className={`${textStyles['caption-medium']} text-status-error`}>
              {error}
            </p>
          )}
          <Button type="submit" inactive={submitting} className="w-full">
            {submitting ? '로그인 중...' : '로그인'}
          </Button>

          <p
            className={`${textStyles['caption-medium']} text-center text-white`}
          >
            {/*아이디 찾기 |{' '}*/}
            <button
              type="button"
              onClick={() => setIsForgotOpen(true)}
              className="cursor-pointer text-white"
            >
              비밀번호 찾기
            </button>{' '}
            |{' '}
            <button
              type="button"
              onClick={() => setIsSignupOpen(true)}
              className="cursor-pointer text-white"
            >
              회원가입 하기
            </button>
          </p>

          <div className="mt-6 flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-white" />
            <span className={`${textStyles['footnote']} text-white`}>
              SNS 계정으로 로그인
            </span>
            <div className="h-px flex-1 bg-white" />
          </div>

          <Button
            type="button"
            onClick={handleKakaoLogin}
            className="w-full gap-2 !bg-[#ffea00] !text-black"
          >
            <img src={kakaoIcon} alt="" className="size-5" />
            카카오 로그인
          </Button>
        </motion.form>
      </div>

      <AnimatePresence>
        {isSignupOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 50, stiffness: 280 }}
            className="absolute inset-x-0 bottom-0 top-[52px] z-50"
          >
            <SignupModal onClose={() => setIsSignupOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isForgotOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 50, stiffness: 280 }}
            className="absolute inset-x-0 bottom-0 top-[52px] z-50"
          >
            <ForgotPasswordModal onClose={() => setIsForgotOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
