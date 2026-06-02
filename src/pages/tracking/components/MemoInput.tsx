interface MemoInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  saving?: boolean;
  status?: string;
}

export function MemoInput({
  value,
  onChange,
  onSave,
  saving,
  status = '방금 작성됨',
}: MemoInputProps) {
  return (
    <div className="flex h-[76px] flex-col gap-1 rounded-[12px] border-[1.5px] border-primary bg-white px-4 py-3.5">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="오늘 러닝은 어땠나요?"
        className="w-full flex-1 resize-none bg-transparent text-[12px] font-medium text-[#121721] outline-none placeholder:text-text-placeholder"
      />
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-text-placeholder">{status}</span>
        <button
          type="button"
          onClick={onSave}
          disabled={!onSave || saving}
          className="font-medium text-primary disabled:opacity-50"
        >
          {saving ? '저장 중...' : '수정'}
        </button>
      </div>
    </div>
  );
}
