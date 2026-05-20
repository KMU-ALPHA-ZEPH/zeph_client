import { useEffect, type ReactNode } from 'react';
import { Button } from '@/components/common/Button';
import { textStyles } from '@/styles/tokens';

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  children: ReactNode;
};

export default function OptionModal({
  open,
  title,
  onClose,
  onConfirm,
  confirmDisabled = false,
  children,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex w-full max-w-[390px] flex-col gap-4 rounded-t-[20px] bg-surface-white px-6 pb-6 pt-7">
        <h2 className={`text-text-primary ${textStyles['heading-h3']}`}>
          {title}
        </h2>
        <div className="flex flex-col gap-4">{children}</div>
        <Button
          className="mt-2 w-full"
          inactive={confirmDisabled}
          onClick={onConfirm}
        >
          확인
        </Button>
      </div>
    </div>
  );
}
