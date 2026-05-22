import { useEffect, useState } from 'react';
import { textStyles } from '@/styles/tokens';
import OptionModal from './OptionModal';

const MAX_LEN = 300;

type Props = {
  open: boolean;
  value: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
};

export default function AIPromptModal({
  open,
  value,
  onClose,
  onConfirm,
}: Props) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const length = draft.length;

  return (
    <OptionModal
      open={open}
      title="AI 프롬프트"
      onClose={onClose}
      onConfirm={() => onConfirm(draft.trim())}
    >
      <div className="flex flex-col gap-2">
        <p className={`text-gray-500 ${textStyles['body-small']}`}>
          AI에게 추가로 전달할 요청사항을 자유롭게 입력해주세요.
        </p>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, MAX_LEN))}
          placeholder="예: 한강이 보이는 코스로 추천해줘"
          rows={5}
          className={`w-full resize-none rounded-[10px] border border-gray-200 bg-surface-white px-3.5 py-3 text-text-primary outline-none placeholder:text-text-placeholder focus:border-primary ${textStyles['body-medium']}`}
        />
        <p
          className={`self-end text-gray-500 ${textStyles['caption-default']}`}
        >
          {length} / {MAX_LEN}
        </p>
      </div>
    </OptionModal>
  );
}
