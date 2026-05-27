import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileIcon from '@/assets/icons/profile_avatar.svg?react';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import ProfileEditModal from '@/components/ProfileEditModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  name?: string;
  email?: string;
  onEditClick?: () => void;
  onPasswordClick?: () => void;
  onLogoutClick?: () => void;
  onDeleteClick?: () => void;
};

export default function AccountModal({
  isOpen,
  onClose,
  name = '이가인',
  email = 'gainlee@kookmin.ac.kr',
  onEditClick,
  onPasswordClick,
  onLogoutClick,
  onDeleteClick,
}: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [displayName, setDisplayName] = useState(name);

  useEffect(() => {
    setDisplayName(name);
  }, [name]);

  const handleEditClick = () => {
    if (onEditClick) onEditClick();
    else setIsEditOpen(true);
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
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="계정"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[784px] max-h-[calc(100dvh-env(safe-area-inset-top))] w-full max-w-[390px] flex-col overflow-hidden rounded-t-[20px] bg-surface-white pb-[env(safe-area-inset-bottom)]"
          >
            <header className="flex h-[60px] items-center justify-between px-3">
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="flex size-7 items-center justify-center text-black"
              >
                <BackIcon className="size-6" />
              </button>
              <p className="text-body-lg font-medium text-text-primary">계정</p>
              <div className="size-7" aria-hidden />
            </header>

            <div className="mx-5 mt-4 flex items-center gap-[11px] rounded-[10px] bg-surface-white px-[13px] py-[11px] shadow-[0px_2px_6px_rgba(0,0,0,0.10)]">
              <ProfileIcon className="size-12" />
              <div className="flex flex-1 items-center justify-between">
                <div className="flex flex-col gap-[3px]">
                  <span className="text-body-md text-text-primary">
                    {displayName}
                  </span>
                  <span className="text-body-sm text-gray-500">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="text-body-md text-primary"
                >
                  편집
                </button>
              </div>
            </div>

            <ul className="mt-[33px] flex flex-col px-5 divide-y divide-gray-400">
              <li>
                <button
                  type="button"
                  onClick={onPasswordClick}
                  className="flex h-[56px] w-full items-center px-[14px] text-left text-body-md text-text-primary"
                >
                  비밀번호 변경
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onLogoutClick}
                  className="flex h-[56px] w-full items-center px-[14px] text-left text-body-md text-text-primary"
                >
                  로그아웃
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onDeleteClick}
                  className="flex h-[56px] w-full items-center px-[14px] text-left text-body-md text-status-error"
                >
                  계정 삭제
                </button>
              </li>
            </ul>
          </motion.div>

          <ProfileEditModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            initialNickname={displayName}
            onSubmit={({ nickname }) => setDisplayName(nickname)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
