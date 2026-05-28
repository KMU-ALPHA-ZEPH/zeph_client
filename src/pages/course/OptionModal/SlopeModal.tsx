import { useEffect, useState } from 'react';
import OptionModal from './OptionModal';
import OptionItem from './OptionItem';

export type SlopeValue = 'low' | 'normal' | 'high';

const OPTIONS: {
  value: SlopeValue;
  title: string;
  description: React.ReactNode;
}[] = [
  {
    value: 'low',
    title: '낮은 경사 (평지 위주)',
    description: '오르막, 내리막이 적은 평지 위주 코스',
  },
  {
    value: 'normal',
    title: '보통',
    description: '약간의 오르막, 내리막이 포함된 코스',
  },
  {
    value: 'high',
    title: '높은 경사 (오르막 위주)',
    description: '운동 강도를 높일 수 있는 오르막 위주 코스',
  },
];

type Props = {
  open: boolean;
  value: SlopeValue | null;
  onClose: () => void;
  onConfirm: (value: SlopeValue) => void;
};

export default function SlopeModal({ open, value, onClose, onConfirm }: Props) {
  const [draft, setDraft] = useState<SlopeValue | null>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <OptionModal
      open={open}
      title="경사도"
      onClose={onClose}
      onConfirm={() => draft && onConfirm(draft)}
      confirmDisabled={!draft}
    >
      {OPTIONS.map((o) => (
        <OptionItem
          key={o.value}
          title={o.title}
          description={o.description}
          selected={draft === o.value}
          onClick={() => setDraft(o.value)}
        />
      ))}
    </OptionModal>
  );
}
