import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = '삭제',
  cancelLabel = '취소',
  onConfirm,
}: Props) {
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
            aria-label={title}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 flex w-[280px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5 rounded-[20px] bg-surface-white p-6"
          >
            <p className="text-center text-body-lg font-medium text-text-primary">
              {title}
            </p>
            {message && (
              <p className="whitespace-pre-line text-center text-body-md text-text-secondary">
                {message}
              </p>
            )}
            <div className="flex w-full items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 flex-1 rounded-[5px] border-[0.5px] border-gray-500 text-body-md text-gray-500"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="h-10 flex-1 rounded-[5px] bg-primary text-body-md text-white"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
