interface MemoInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function MemoInput({ value, onChange }: MemoInputProps) {
  return (
    <div className="flex h-[76px] flex-col gap-1 rounded-[12px] border-[1.5px] border-primary bg-white px-4 py-3.5">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="오늘 러닝은 어땠나요?"
        className="w-full flex-1 resize-none bg-transparent text-[12px] font-medium text-[#121721] outline-none placeholder:text-text-placeholder"
      />
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-text-placeholder">방금 작성됨</span>
        <span className="font-medium text-primary">수정</span>
      </div>
    </div>
  );
}
