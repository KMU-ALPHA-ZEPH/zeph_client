import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import { Button } from '@/components/common/Button';
import CameraIcon from '@/assets/icons/frame_250.svg?react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialNickname?: string;
  initialAvatarUrl?: string;
  onSubmit?: (data: { nickname: string; avatarUrl?: string }) => void;
};

export default function ProfileEditModal({
  isOpen,
  onClose,
  initialNickname = '이가인',
  initialAvatarUrl,
  onSubmit,
}: Props) {
  const [nickname, setNickname] = useState(initialNickname);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    initialAvatarUrl,
  );

  useEffect(() => {
    if (isOpen) {
      setNickname(initialNickname);
      setAvatarUrl(initialAvatarUrl);
    }
  }, [isOpen, initialNickname, initialAvatarUrl]);

  const handleSubmit = () => {
    onSubmit?.({ nickname, avatarUrl });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="프로필 편집"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 flex w-[360px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[35px] overflow-hidden rounded-[20px] bg-surface-white pb-14"
          >
            <header className="relative flex h-[60px] w-full items-center justify-center px-3">
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="absolute left-3 flex size-7 items-center justify-center text-black"
              >
                <BackIcon className="size-6" />
              </button>
              <p className="text-body-lg font-medium text-text-primary">
                프로필 편집
              </p>
            </header>

            <div className="flex w-[320px] flex-col gap-6">
              <div className="flex flex-col items-center gap-6">
                <div className="relative size-[120px] overflow-hidden rounded-full border-[0.5px] border-gray-500 bg-gray-300">
                  {avatarUrl && (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    aria-label="사진 변경"
                    onClick={() => {
                      /* TODO: image picker */
                    }}
                    className="absolute left-1/2 top-1/2 grid size-[68px] -translate-x-1/2 -translate-y-1/2 place-items-center"
                  >
                    <CameraIcon className="size-full" />
                  </button>
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label
                    htmlFor="profile-nickname"
                    className="px-2.5 text-body-md text-text-primary"
                  >
                    닉네임
                  </label>
                  <input
                    id="profile-nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="이가인"
                    className="h-10 w-full rounded-[5px] border-[0.5px] border-primary px-[18px] text-body-sm text-text-primary outline-none placeholder:text-text-placeholder"
                  />
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full">
                완료
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
