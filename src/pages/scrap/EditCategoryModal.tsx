import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import CameraIcon from '@/assets/icons/camera.svg?react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  initialName?: string;
  initialDescription?: string;
  initialImageUrl?: string;
  onSubmit: (data: {
    name: string;
    description: string;
    imageUrl?: string;
    imageFile?: File;
  }) => void;
};

export default function EditCategoryModal({
  isOpen,
  onClose,
  title = '카테고리 수정',
  initialName = '',
  initialDescription = '',
  initialImageUrl,
  onSubmit,
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
      setImageUrl(initialImageUrl);
      setImageFile(undefined);
    }
  }, [isOpen, initialName, initialDescription, initialImageUrl]);

  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      imageUrl,
      imageFile,
    });
    onClose();
  };

  const handleImagePick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
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
            aria-label="카테고리 수정"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[574px] w-full max-w-[390px] flex-col overflow-hidden rounded-t-[20px] bg-surface-white"
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
                {title}
              </p>
            </header>

            <div className="mt-[54px] flex justify-center">
              <button
                type="button"
                aria-label="사진 변경"
                onClick={handleImagePick}
                className="relative size-[120px] overflow-hidden rounded-[10px] border-[0.5px] border-gray-500 bg-gray-300"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="absolute left-1/2 top-1/2 grid size-[68px] -translate-x-1/2 -translate-y-1/2 place-items-center">
                    <CameraIcon className="size-full" />
                  </span>
                )}
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-5 px-[35px]">
              <Input
                id="edit-cat-name"
                label={
                  <>
                    이름 <span className="text-primary">*</span>
                  </>
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex) 산책하기 좋은 코스"
              />
              <Input
                id="edit-cat-desc"
                label="소개"
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
                완료
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
