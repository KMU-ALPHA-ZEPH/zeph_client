import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeaderBack } from '@/components/common/Header/HeaderBack';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { textStyles } from '@/styles/tokens';
import TermsModal from './TermsModal';

interface SignupModalProps {
  onClose?: () => void;
}

export default function SignupModal({ onClose }: SignupModalProps) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white pt-[11px]">
      <HeaderBack title="회원가입" onBack={onClose} />

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
        />
        <Input
          label="이메일"
          type="email"
          placeholder="이메일을 입력하세요"
          className="w-full"
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          className="w-full"
        />
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

      <div className="mt-60 px-9 pb-22">
        <Button inactive={!agreed} className="w-full">
          회원가입
        </Button>
        <p className={`${textStyles['body-small']} mt-6 text-center`}>
          <span className="text-text-secondary">이미 계정이 있으신가요? </span>
          <button
            type="button"
            onClick={onClose}
            className={`${textStyles['body-small']} text-black cursor-pointer`}
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
    </div>
  );
}
