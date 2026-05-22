type Props = {
  date: Date;
  joinYear: number;
  onChange: (d: Date) => void;
};

export default function MonthPicker({ date, joinYear, onChange }: Props) {
  const currentYear = new Date().getFullYear();
  const selectedYear = date.getFullYear();
  const selectedMonth = date.getMonth() + 1;
  const years: number[] = [];
  for (let y = currentYear; y >= joinYear; y--) years.push(y);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="absolute left-0 top-full z-30 mt-1 flex w-[180px] gap-1 rounded-[5px] border border-gray-400 bg-surface-white p-1 shadow-base">
      <ul className="flex max-h-[200px] flex-1 flex-col overflow-y-auto">
        {years.map((y) => {
          const isActive = y === selectedYear;
          return (
            <li key={y}>
              <button
                type="button"
                onClick={() => onChange(new Date(y, selectedMonth - 1, 1))}
                className={`block w-full rounded px-3 py-1.5 text-center text-body-sm ${
                  isActive
                    ? 'bg-primary font-semibold text-white'
                    : 'text-text-primary hover:bg-gray-100'
                }`}
              >
                {y}년
              </button>
            </li>
          );
        })}
      </ul>
      <ul className="flex max-h-[200px] flex-1 flex-col overflow-y-auto">
        {months.map((m) => {
          const isActive = m === selectedMonth;
          return (
            <li key={m}>
              <button
                type="button"
                onClick={() => onChange(new Date(selectedYear, m - 1, 1))}
                className={`block w-full rounded px-3 py-1.5 text-center text-body-sm ${
                  isActive
                    ? 'bg-primary font-semibold text-white'
                    : 'text-text-primary hover:bg-gray-100'
                }`}
              >
                {m}월
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
