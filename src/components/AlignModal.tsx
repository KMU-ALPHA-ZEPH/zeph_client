import { AnimatePresence, motion } from 'framer-motion';

export type AlignKey = 'popular' | 'distance-asc' | 'distance-desc' | 'nearest';

export const ALIGN_OPTIONS: { key: AlignKey; label: string }[] = [
  { key: 'popular', label: '인기순' },
  { key: 'distance-asc', label: '낮은 거리 순' },
  { key: 'distance-desc', label: '높은 거리순' },
  { key: 'nearest', label: '가까운순' },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  value: AlignKey;
  onChange: (value: AlignKey) => void;
};

export default function AlignModal({
  isOpen,
  onClose,
  value,
  onChange,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-black/30"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="정렬 선택"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
            className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[390px] flex-col rounded-t-[10px] bg-surface-white pb-10 pl-[15px] pr-[15px] pt-2 shadow-[0px_2px_6px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-center justify-center pb-3">
              <span
                aria-hidden="true"
                className="h-1 w-16 rounded-full bg-gray-400"
              />
            </div>

            <h2 className="text-body-lg px-[10px] pb-2 font-bold text-text-primary">
              정렬
            </h2>

            <ul className="flex flex-col">
              {ALIGN_OPTIONS.map((opt, idx) => {
                const isSelected = opt.key === value;
                const isLast = idx === ALIGN_OPTIONS.length - 1;
                return (
                  <li key={opt.key}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.key);
                        onClose();
                      }}
                      className={`flex h-[47px] w-full items-center justify-between p-[10px] ${
                        isLast ? '' : 'border-b border-gray-400'
                      }`}
                    >
                      <span
                        className={`text-body-md text-text-primary ${
                          isSelected ? 'font-semibold' : 'font-medium'
                        }`}
                      >
                        {opt.label}
                      </span>
                      {isSelected && <CheckIcon />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 12L10 18L20 6"
        stroke="var(--color-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
