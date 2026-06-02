import { useEffect, useState } from 'react';
import { SearchIcon } from '@/components/common/Icon/SearchIcon';
import { searchKakaoPlaces, type KakaoPlace } from '@/apis/kakaoLocal';
import { textStyles } from '@/styles/tokens';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSelect: (place: KakaoPlace) => void;
  placeholder?: string;
};

export default function CourseSearchBar({
  value,
  onChange,
  onSelect,
  placeholder = '러닝을 시작할 위치를 검색하세요',
}: Props) {
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = value.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const items = await searchKakaoPlaces(q);
      setResults(items);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [value]);

  const showDropdown = open && value.trim().length > 0;

  return (
    <div className="relative w-full max-w-[280px]">
      <label className="flex h-[40px] w-full items-center gap-1 rounded-full bg-[#B0F0DB]/70 px-[22px] shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
        <span className="grid size-[18px] shrink-0 place-items-center text-gray-500">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className={`ml-2 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-primary/80 ${textStyles['body-medium']}`}
        />
      </label>

      {showDropdown && (
        <ul className="absolute inset-x-0 top-[44px] max-h-[280px] overflow-y-auto rounded-[12px] bg-surface-white shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
          {loading ? (
            <li
              className={`px-4 py-3 text-gray-500 ${textStyles['body-small']}`}
            >
              검색 중...
            </li>
          ) : results.length === 0 ? (
            <li
              className={`px-4 py-3 text-gray-500 ${textStyles['body-small']}`}
            >
              검색 결과가 없습니다
            </li>
          ) : (
            results.map((p, idx) => (
              <li key={`${p.name}-${p.address}-${idx}`}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onSelect(p);
                    onChange(p.name);
                    setOpen(false);
                  }}
                  className="flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left hover:bg-gray-100"
                >
                  <span
                    className={`text-text-primary ${textStyles['body-medium-med']}`}
                  >
                    {p.name}
                  </span>
                  {p.address && p.address !== p.name && (
                    <span
                      className={`text-gray-500 ${textStyles['body-small']}`}
                    >
                      {p.address}
                    </span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
