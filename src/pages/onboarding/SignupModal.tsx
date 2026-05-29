import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '@/components/common/Header';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { textStyles } from '@/styles/tokens';
import { signup } from '@/apis/auth';
import { saveAuth } from '@/lib/auth';
import TermsModal from './TermsModal';

interface SignupModalProps {
  onClose?: () => void;
}

export default function SignupModal({ onClose }: SignupModalProps) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const canSubmit =
    agreed &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      const auth = await signup({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      saveAuth(auth);
      navigate('/popular-page', { replace: true });
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.status === 409
          ? '이미 가입된 이메일입니다.'
          : '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto flex h-full w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white pt-[11px]"
    >
      <Header variant="back" title="회원가입" onBack={onClose} />

      <div className="px-9 pt-[10px]">
        <p className={`${textStyles['body-medium']} leading-6 text-black`}>
          로그인에 사용할
          <br />
          이메일과 비밀번호를 입력해주세요.
        </p>
      </div>

      <div className="flex flex-col gap-[19px] px-9 pt-[25px]">
        <Input
          label="닉네임"
          placeholder="ex) 러닝하는오랑이"
          className="w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="이메일을 입력하세요"
          className="w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="비밀번호"
          type="password"
          autoComplete="new-password"
          placeholder="비밀번호를 입력하세요"
          className="w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p className={`${textStyles['caption-medium']} text-status-error`}>
            {error}
          </p>
        )}
      </div>

      <div className="mt-[15px] flex justify-end px-10">
        <label
          className={`${textStyles['body-small']} flex cursor-pointer items-center gap-2 text-black`}
        >
          개인정보 처리에 동의합니다
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setIsTermsOpen(true)}
            className="size-[15px] cursor-pointer rounded-[3px] border border-gray-500 accent-black"
          />
        </label>
      </div>

      <div className="mt-auto px-9 pb-[calc(env(safe-area-inset-bottom)+5.5rem)]">
        <Button type="submit" inactive={!canSubmit} className="w-full">
          {submitting ? '가입 중...' : '회원가입'}
        </Button>
        <p className={`${textStyles['body-small']} mt-6 text-center`}>
          <span className="text-text-secondary">이미 계정이 있으신가요? </span>
          <button
            type="button"
            onClick={onClose}
            className={`${textStyles['body-small']} cursor-pointer text-black`}
          >
            로그인하기
          </button>
        </p>
      </div>

      <AnimatePresence>
        {isTermsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50"
          >
            <TermsModal
              onClose={() => {
                setAgreed(false);
                setIsTermsOpen(false);
              }}
              onConfirm={() => {
                setAgreed(true);
                setIsTermsOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
