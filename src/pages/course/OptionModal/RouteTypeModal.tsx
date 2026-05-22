import { useEffect, useState } from 'react';
import OptionModal from './OptionModal';
import OptionItem from './OptionItem';

export type RouteTypeValue = 'round' | 'oneway';

const OPTIONS: {
  value: RouteTypeValue;
  title: string;
  description: string;
  emoji: string;
}[] = [
  {
    value: 'round',
    title: '왕복',
    description: '출발지로 다시 돌아오는 코스',
    emoji: '🔁',
  },
  {
    value: 'oneway',
    title: '편도',
    description: '출발지에서 다른 지점으로 향하는 코스',
    emoji: '➡️',
  },
];

type Props = {
  open: boolean;
  value: RouteTypeValue | null;
  onClose: () => void;
  onConfirm: (value: RouteTypeValue) => void;
};

export default function RouteTypeModal({
  open,
  value,
  onClose,
  onConfirm,
}: Props) {
  const [draft, setDraft] = useState<RouteTypeValue | null>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <OptionModal
      open={open}
      title="왕복 / 편도"
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
