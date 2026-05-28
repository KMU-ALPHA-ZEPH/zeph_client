import { useEffect, useState } from 'react';
import OptionModal from './OptionModal';
import OptionItem from './OptionItem';

export type SafetyValue = 'low' | 'normal' | 'high';

const OPTIONS: {
  value: SafetyValue;
  title: string;
  description: React.ReactNode;
}[] = [
  {
    value: 'low',
    title: '낮음',
    description: '오르막, 내리막이 적은 평지 위주 코스',
  },
  {
    value: 'normal',
    title: '보통',
    description: '약간의 오르막, 내리막이 포함된 코스',
  },
  {
    value: 'high',
    title: '높음',
    description: '운동 강도를 높일 수 있는 오르막 위주 코스',
  },
];

type Props = {
  open: boolean;
  value: SafetyValue | null;
  onClose: () => void;
  onConfirm: (value: SafetyValue) => void;
};

export default function SafetyModal({
  open,
  value,
  onClose,
  onConfirm,
}: Props) {
  const [draft, setDraft] = useState<SafetyValue | null>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <OptionModal
      open={open}
      title="안전"
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
