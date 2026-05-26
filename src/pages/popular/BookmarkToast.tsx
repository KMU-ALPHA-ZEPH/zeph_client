import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HeartIcon from '@/assets/icons/mynaui_heart-solid.svg?react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
};

export default function BookmarkToast({
  isOpen,
  onClose,
  message = '좋아요 표시한 코스에 추가되었습니다',
  icon = <HeartIcon />,
  actionLabel,
  onAction,
  durationMs = 1500,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onClose, durationMs);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, durationMs]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="status"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="fixed inset-x-0 bottom-[90px] z-50 mx-auto flex h-16 w-[318px] items-center gap-[15px] rounded-[10px] bg-black px-[17px] pb-[9px] pt-2"
        >
          {icon}
          <div className="flex flex-1 items-center justify-between">
            <span className="text-[13px] font-normal text-white">
              {message}
            </span>
            {actionLabel && onAction && (
              <button
                type="button"
                onClick={onAction}
                className="text-[13px] font-normal text-primary"
              >
                {actionLabel}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
