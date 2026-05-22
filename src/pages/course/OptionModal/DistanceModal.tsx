import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { textStyles } from '@/styles/tokens';
import OptionModal from './OptionModal';

export type DistanceValue = number;

const MIN_KM = 1;
const MAX_KM = 20;
const ITEMS: number[] = Array.from(
  { length: MAX_KM - MIN_KM + 1 },
  (_, i) => MIN_KM + i,
);

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;
const PAD_COUNT = Math.floor(VISIBLE_COUNT / 2);
const PAD_HEIGHT = ITEM_HEIGHT * PAD_COUNT;

type Props = {
  open: boolean;
  value: DistanceValue | null;
  onClose: () => void;
  onConfirm: (value: DistanceValue) => void;
};

export default function DistanceModal({
  open,
  value,
  onClose,
  onConfirm,
}: Props) {
  const initialIdx = ITEMS.indexOf(value ?? 5);
  const [centerIdx, setCenterIdx] = useState(
    initialIdx >= 0 ? initialIdx : ITEMS.indexOf(5),
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const settleTimer = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    const startIdx = ITEMS.indexOf(value ?? 5);
    const target = (startIdx >= 0 ? startIdx : ITEMS.indexOf(5)) * ITEM_HEIGHT;
    el.scrollTop = target;
    setCenterIdx(startIdx >= 0 ? startIdx : ITEMS.indexOf(5));
  }, [open, value]);

  useEffect(() => {
    return () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(ITEMS.length - 1, idx));
    if (clamped !== centerIdx) setCenterIdx(clamped);

    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const settledIdx = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clampedSettled = Math.max(
        0,
        Math.min(ITEMS.length - 1, settledIdx),
      );
      el.scrollTo({ top: clampedSettled * ITEM_HEIGHT, behavior: 'smooth' });
    }, 120);
  };

  const handleItemClick = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
  };

  return (
    <OptionModal
      open={open}
      title="목표 거리"
      onClose={onClose}
      onConfirm={() => onConfirm(ITEMS[centerIdx])}
    >
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 rounded-[10px] border-[1.5px] border-primary bg-primary-tint"
          style={{ height: ITEM_HEIGHT }}
          aria-hidden="true"
        />
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative z-10 overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            height: CONTAINER_HEIGHT,
            scrollSnapType: 'y mandatory',
          }}
        >
          <div style={{ height: PAD_HEIGHT }} aria-hidden="true" />
          {ITEMS.map((km, idx) => {
            const diff = Math.abs(idx - centerIdx);
            const isCenter = diff === 0;
            const isFar = diff >= 2;
            return (
              <button
                key={km}
                type="button"
                onClick={() => handleItemClick(idx)}
                className={`flex w-full items-center justify-center ${textStyles['body-large']} ${
                  isCenter
                    ? 'text-primary'
                    : isFar
                      ? 'text-text-placeholder opacity-50'
                      : 'text-text-primary'
                }`}
                style={{
                  height: ITEM_HEIGHT,
                  scrollSnapAlign: 'center',
                  scrollSnapStop: 'always',
                }}
              >
                {km} km
              </button>
            );
          })}
          <div style={{ height: PAD_HEIGHT }} aria-hidden="true" />
        </div>
      </div>
    </OptionModal>
  );
}
