import { useEffect, useState } from 'react';
import OptionModal from './OptionModal';
import OptionItem from './OptionItem';

export type FacilityValue = 'prefer' | 'none';

const OPTIONS: {
  value: FacilityValue;
  title: string;
  description: React.ReactNode;
}[] = [
  {
    value: 'prefer',
    title: '있는 거 선호',
    description: (
      <>
        화장실, 편의점, 카페 등
        <br />
        편의시설이 있는 코스를 선호해요
      </>
    ),
  },
  {
    value: 'none',
    title: '고려하지 않음',
    description: '편의시설은 고려하지 않아요',
  },
];

type Props = {
  open: boolean;
  value: FacilityValue | null;
  onClose: () => void;
  onConfirm: (value: FacilityValue) => void;
};

export default function FacilityModal({
  open,
  value,
  onClose,
  onConfirm,
}: Props) {
  const [draft, setDraft] = useState<FacilityValue | null>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <OptionModal
      open={open}
      title="편의시설"
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
