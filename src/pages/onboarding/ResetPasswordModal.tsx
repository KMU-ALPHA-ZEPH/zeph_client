import { useState, type FormEvent } from 'react';
import axios from 'axios';
import Header from '@/components/common/Header';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import { textStyles } from '@/styles/tokens';
import { confirmPasswordReset } from '@/apis/auth';

interface ResetPasswordModalProps {
  /** 메일 링크에서 받은 재설정 토큰 */
  token: string;
  /** 닫기 / 완료 후 호출 */
  onClose?: () => void;
  onDone?: () => void;
}

const MIN_LENGTH = 8;

/**
 * 비밀번호 찾기 2단계: 메일 링크로 받은 토큰 + 새 비밀번호로 재설정한다.
 */
export default function ResetPasswordModal({
  token,
  onClose,
  onDone,
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const canSubmit =
    password.length >= MIN_LENGTH && confirm.length > 0 && !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('유효하지 않은 링크예요. 메일의 링크를 다시 확인해주세요.');
      return;
    }
    if (password.length < MIN_LENGTH) {
      setError(`비밀번호는 ${MIN_LENGTH}자 이상이어야 해요.`);
      return;
    }
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않아요.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await confirmPasswordReset(token, password);
      setSuccessOpen(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // 진단용: 백엔드가 준 상태코드 + 응답 본문
        console.error(
          '[reset] failed',
          err.response?.status,
          err.response?.data,
        );
      }
      const message =
        axios.isAxiosError(err) && err.response?.status === 400
          ? '링크가 만료되었거나 유효하지 않아요. 재설정 메일을 다시 요청해주세요.'
          : '비밀번호 재설정에 실패했어요. 잠시 후 다시 시도해주세요.';
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
      <Header variant="back" title="비밀번호 재설정" onBack={onClose} />

      <div className="px-9 pt-[10px]">
        <p className={`${textStyles['body-medium']} leading-6 text-black`}>
          새로 사용할 비밀번호를
          <br />
          입력해주세요. ({MIN_LENGTH}자 이상)
        </p>
      </div>

      <div className="flex flex-col gap-[19px] px-9 pt-[25px]">
        <Input
          label="새 비밀번호"
          type="password"
          autoComplete="new-password"
          placeholder="새 비밀번호를 입력하세요"
          className="w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="새 비밀번호 확인"
          type="password"
          autoComplete="new-password"
          placeholder="새 비밀번호를 다시 입력하세요"
          className="w-full"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error && (
          <p className={`${textStyles['caption-medium']} text-status-error`}>
            {error}
          </p>
        )}
      </div>

      <div className="mt-auto px-9 pb-[calc(env(safe-area-inset-bottom)+5.5rem)]">
        <Button type="submit" inactive={!canSubmit} className="w-full">
          {submitting ? '변경 중...' : '비밀번호 변경하기'}
        </Button>
      </div>

      <ConfirmModal
        isOpen={successOpen}
        title="비밀번호가 변경되었어요"
        message={'새 비밀번호로 다시 로그인해주세요.'}
        confirmLabel="로그인하기"
        cancelLabel="닫기"
        onConfirm={() => {}}
        onClose={() => {
          setSuccessOpen(false);
          onDone?.();
        }}
      />
    </form>
  );
}
