import { useEffect, useState } from 'react';
import OptionModal from './OptionModal';
import OptionItem from './OptionItem';

export type CourseTypeValue = 'workout' | 'walk' | 'safety';

const OPTIONS: {
  value: CourseTypeValue;
  title: string;
  description: React.ReactNode;
  emoji: string;
}[] = [
  {
    value: 'workout',
    title: '운동',
    description: '횡단보도가 최대한 없는 코스',
    emoji: '🏃',
  },
  {
    value: 'walk',
    title: '산책',
    description: (
      <>
        횡단보도 상관없음,
        <br />
        공원과 편의시설이 조금 있는 코스
      </>
    ),
    emoji: '🚶',
  },
  {
    value: 'safety',
    title: '안전',
    description: (
      <>
        교통량을 고려해 차량이
        <br />
        최대한 없는 코스
      </>
    ),
    emoji: '🛡',
  },
];

type Props = {
  open: boolean;
  value: CourseTypeValue | null;
  onClose: () => void;
  onConfirm: (value: CourseTypeValue) => void;
};

export default function CourseTypeModal({
  open,
  value,
  onClose,
  onConfirm,
}: Props) {
  const [draft, setDraft] = useState<CourseTypeValue | null>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <OptionModal
      open={open}
      title="코스 유형"
      onClose={onClose}
      onConfirm={() => draft && onConfirm(draft)}
      confirmDisabled={!draft}
    >
      {OPTIONS.map((o) => (
        <OptionItem
          key={o.value}
          icon={<span className="text-base">{o.emoji}</span>}
          title={o.title}
          description={o.description}
          selected={draft === o.value}
          onClick={() => setDraft(o.value)}
        />
      ))}
    </OptionModal>
  );
}
