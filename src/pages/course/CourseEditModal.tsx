import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
  initialDescription?: string;
  onSubmit: (data: {
    name: string;
    description: string;
  }) => void | Promise<void>;
};

export default function CourseEditModal({
  isOpen,
  onClose,
  initialName = '',
  initialDescription = '',
  onSubmit,
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
    }
  }, [isOpen, initialName, initialDescription]);

  const canSubmit = name.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      onClose();
    } finally {
      setSubmitting(false);
    }
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
            aria-label="코스 수정"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[420px] w-full max-w-[390px] flex-col overflow-hidden rounded-t-[20px] bg-surface-white pb-[env(safe-area-inset-bottom)]"
          >
            <header className="relative flex h-[60px] items-center justify-center px-3">
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="absolute left-3 flex size-7 items-center justify-center text-black"
              >
                <BackIcon className="size-6" />
              </button>
              <p className="text-body-lg font-medium text-text-primary">
                코스 수정
              </p>
            </header>

            <div className="mt-2 flex flex-col gap-5 px-[35px]">
              <Input
                id="edit-course-name"
                label={
                  <>
                    이름 <span className="text-primary">*</span>
                  </>
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex) 정릉 한 바퀴"
              />
              <Input
                id="edit-course-desc"
                label="설명"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ex) 완만한 경사도, 공원 위주"
              />
            </div>

            <div className="mt-auto px-[35px] pb-[28px]">
              <Button
                onClick={handleSubmit}
                inactive={!canSubmit}
                className="w-full"
              >
                {submitting ? '저장 중...' : '완료'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
