import { useState, type FormEvent } from 'react';
import axios from 'axios';
import Header from '@/components/common/Header';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import { textStyles } from '@/styles/tokens';
import { requestPasswordReset } from '@/apis/auth';

interface ForgotPasswordModalProps {
  onClose?: () => void;
}

/**
 * 비밀번호 찾기 1단계: 이메일을 입력하면 재설정 메일을 발송한다.
 * 메일의 링크(…/reset-password?token=…)를 누르면 ResetPasswordPage 로 이동한다.
 */
export default function ForgotPasswordModal({
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const canSubmit = email.trim().length > 0 && !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await requestPasswordReset(email.trim());
      setSuccessOpen(true);
    } catch (err) {
      // 보안상 백엔드가 "가입되지 않은 이메일"도 성공처럼 처리할 수 있으나,
      // 형식 오류 등 4xx 는 안내한다.
      const message =
        axios.isAxiosError(err) && err.response?.status === 400
          ? '이메일 형식을 확인해주세요.'
          : '메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.';
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
      <Header variant="back" title="비밀번호 찾기" onBack={onClose} />

      <div className="px-9 pt-[10px]">
        <p className={`${textStyles['body-medium']} leading-6 text-black`}>
          가입한 이메일을 입력하면
          <br />
          비밀번호 재설정 메일을 보내드려요.
        </p>
      </div>

      <div className="flex flex-col gap-[19px] px-9 pt-[25px]">
        <Input
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="이메일을 입력하세요"
          className="w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && (
          <p className={`${textStyles['caption-medium']} text-status-error`}>
            {error}
          </p>
        )}
      </div>

      <div className="mt-auto px-9 pb-[calc(env(safe-area-inset-bottom)+5.5rem)]">
        <Button type="submit" inactive={!canSubmit} className="w-full">
          {submitting ? '발송 중...' : '재설정 메일 보내기'}
        </Button>
        <p className={`${textStyles['body-small']} mt-6 text-center`}>
          <button
            type="button"
            onClick={onClose}
            className={`${textStyles['body-small']} cursor-pointer text-black`}
          >
            로그인으로 돌아가기
          </button>
        </p>
      </div>

      <ConfirmModal
        isOpen={successOpen}
        title="메일을 발송했어요"
        message={
          '입력하신 이메일로 비밀번호 재설정 링크를 보냈어요.\n메일함을 확인해주세요.'
        }
        confirmLabel="확인"
        cancelLabel="닫기"
        onConfirm={() => {}}
        onClose={() => {
          setSuccessOpen(false);
          onClose?.();
        }}
      />
    </form>
  );
}
