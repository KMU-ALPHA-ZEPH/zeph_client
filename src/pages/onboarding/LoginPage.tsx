import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ZephIcon from '@/assets/icons/zeph.svg?react';
import { Icon } from '@/components/common/Icon';
import { InputBox } from '@/components/common/InputBox';
import { Button } from '@/components/common/Button';
import backgroundImage from '@/assets/backgroundImage.png';
import { textStyles } from '@/styles/tokens';
import SignupModal from './SignupModal';

export default function LoginPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="relative mx-auto h-screen w-full max-w-md overflow-hidden bg-black">
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative flex h-full flex-col pb-22">
        <div className="flex flex-1 items-center justify-center">
          <Icon as={ZephIcon} size="sm" />
        </div>

        <div className="items-center flex flex-col gap-3">
          <InputBox strokeNone type="email" placeholder="이메일을 입력하세요" />
          <InputBox
            strokeNone
            type="password"
            placeholder="비밀번호를 입력하세요"
          />
          <Button>로그인</Button>

          <p
            className={`${textStyles['caption-medium']} text-center text-white`}
          >
            아이디 찾기 | 비밀번호 찾기 |{' '}
            <button
              type="button"
              onClick={() => setIsSignupOpen(true)}
              className="text-white"
            >
              회원가입
            </button>
          </p>

          <div className="mt-6 flex w-76 items-center gap-3">
            <div className="h-px flex-1 bg-white" />
            <span className={`${textStyles['footnote']} text-white`}>
              SNS 계정으로 로그인
            </span>
            <div className="h-px flex-1 bg-white" />
          </div>

          <Button className="!bg-[#ffea00] !text-black">카카오 로그인</Button>
        </div>
      </div>

      <AnimatePresence>
        {isSignupOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="absolute inset-x-0 bottom-0 top-[52px] z-50"
          >
            <SignupModal onClose={() => setIsSignupOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
