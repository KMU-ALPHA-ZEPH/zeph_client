import { useEffect, useRef } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = '검색어를 입력해주세요',
  autoFocus = false,
  onSubmit,
  onClose,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (!onClose) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="flex h-8 w-full items-center gap-2 overflow-hidden rounded-[10px] border border-gray-500/90 px-[18px] py-1.5 opacity-70"
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-body-md font-normal text-text-primary outline-none placeholder:text-text-primary/80"
      />
      <SearchIcon />
    </form>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7.5" cy="7.5" r="5.5" stroke="#8D8D8D" strokeWidth="1.8" />
      <path
        d="M12 12L16.5 16.5"
        stroke="#8D8D8D"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
