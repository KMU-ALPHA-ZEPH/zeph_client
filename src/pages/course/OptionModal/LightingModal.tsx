import { useEffect, useState } from 'react';
import OptionModal from './OptionModal';
import OptionItem from './OptionItem';

export type LightingValue = 'bright' | 'any';

const OPTIONS: {
  value: LightingValue;
  title: string;
  description: React.ReactNode;
}[] = [
  {
    value: 'bright',
    title: '가로등 많은 밝은 길',
    description: '가로등이 많은 밝은 길을 선호해요',
  },
  {
    value: 'any',
    title: '조명 상관없음',
    description: '조명은 크게 고려하지 않아요',
  },
];

type Props = {
  open: boolean;
  value: LightingValue | null;
  onClose: () => void;
  onConfirm: (value: LightingValue) => void;
};

export default function LightingModal({
  open,
  value,
  onClose,
  onConfirm,
}: Props) {
  const [draft, setDraft] = useState<LightingValue | null>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <OptionModal
      open={open}
      title="조명 선호"
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
