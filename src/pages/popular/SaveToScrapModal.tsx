import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import HeartIcon from '@/assets/icons/mynaui_heart-solid.svg?react';
import ZephIcon from '@/assets/icons/zeph.svg?react';
import { Button } from '@/components/common/Button';
import { SCRAP_CATEGORIES } from '@/pages/scrap/data';
import { readOverrides } from '@/pages/scrap/overrides';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (categoryId: string, categoryTitle: string) => void;
};

export default function SaveToScrapModal({ isOpen, onClose, onSelect }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const overrides = readOverrides();

  const handleSubmit = () => {
    if (!selectedId) return;
    const cat = SCRAP_CATEGORIES.find((c) => c.id === selectedId);
    if (!cat) return;
    const title = overrides[cat.id]?.title ?? cat.title;
    onSelect(cat.id, title);
    setSelectedId(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedId(null);
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
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="스크랩 저장 위치 선택"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[80dvh] w-full max-w-[390px] flex-col overflow-hidden rounded-t-[20px] bg-surface-white pb-[env(safe-area-inset-bottom)]"
          >
            <header className="relative flex h-[60px] items-center justify-center px-3">
              <button
                type="button"
                onClick={handleClose}
                aria-label="닫기"
                className="absolute left-3 flex size-7 items-center justify-center text-black"
              >
                <BackIcon className="size-6" />
              </button>
              <p className="text-body-lg font-medium text-text-primary">
                어디에 저장할까요?
              </p>
            </header>

            <ul className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 pb-4">
              {SCRAP_CATEGORIES.map((cat) => {
                const title = overrides[cat.id]?.title ?? cat.title;
                const description =
                  overrides[cat.id]?.description ?? cat.description;
                const imageUrl = overrides[cat.id]?.imageUrl ?? cat.imageUrl;
                const isSelected = selectedId === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(cat.id)}
                      className={`flex w-full items-center gap-3 rounded-[10px] border bg-surface-white px-3 py-2 text-left ${
                        isSelected
                          ? 'border-primary'
                          : 'border-transparent shadow-[0px_2px_6px_rgba(0,0,0,0.10)]'
                      }`}
                    >
                      <div className="grid h-12 w-12 flex-shrink-0 place-items-center overflow-hidden rounded-[5px] bg-gray-300">
                        {cat.iconType === 'heart' ? (
                          <HeartIcon className="size-6" />
                        ) : imageUrl ? (
                          <img
                            src={imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ZephIcon className="h-full w-full" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-body-md font-normal text-text-primary">
                            {title}
                          </span>
                          {cat.iconType !== 'heart' && (
                            <span className="text-body-md font-normal text-gray-500">
                              {cat.courses.length}
                            </span>
                          )}
                        </div>
                        {description && (
                          <p className="line-clamp-1 text-body-sm font-normal text-text-secondary">
                            {description}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="px-5 pt-2">
              <Button
                onClick={handleSubmit}
                inactive={!selectedId}
                className="w-full"
              >
                저장
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
