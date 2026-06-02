import { useEffect, useMemo, useState } from 'react';
import TabSelector, { type TabItem } from '@/components/common/TabSelector';
import PeriodSelector, { type Period } from '@/pages/stats/PeriodSelector';
import StatsChart, { type ChartDataPoint } from '@/pages/stats/StatsChart';
import RecordCard from '@/pages/stats/RecordCard';
import TabBarLayout from '@/components/layout/TabBarLayout';
import {
  getRecordStats,
  getRecords,
  type RecordListItem,
  type RecordStatsPeriod,
  type RecordStatsResponse,
  type RecordStatsType,
} from '@/apis/records';

type StatsCategory = 'all' | 'walk' | 'workout' | 'safety';

const STATS_TABS: TabItem<StatsCategory>[] = [
  { key: 'walk', label: '산책 코스' },
  { key: 'workout', label: '운동 코스' },
  { key: 'safety', label: '안전 코스' },
  { key: 'all', label: '전체 코스' },
];

// 백엔드는 type 미지정 시 ALL 로 처리하므로, '전체' 탭은 파라미터를 보내지 않는다.
const CATEGORY_TO_TYPE: Record<StatsCategory, RecordStatsType | undefined> = {
  all: undefined,
  walk: 'walk',
  workout: 'exercise',
  safety: 'safety',
};

const PERIOD_TO_PARAM: Record<Period, RecordStatsPeriod> = {
  week: 'WEEK',
  month: 'MONTH',
  year: 'YEAR',
  all: 'ALL',
};

const EMPTY_STATS: RecordStatsResponse = {
  runCount: 0,
  avgPace: 0,
  totalDurationSec: 0,
  totalDistanceKm: 0,
  breakdown: [],
};

function toDateParam(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function StatsPage() {
  const [category, setCategory] = useState<StatsCategory>('all');
  const [period, setPeriod] = useState<Period>('month');
  const [datesByPeriod, setDatesByPeriod] = useState<Record<Period, Date>>(
    () => ({
      week: new Date(),
      month: new Date(),
      year: new Date(),
      all: new Date(),
    }),
  );
  const [stats, setStats] = useState<RecordStatsResponse>(EMPTY_STATS);
  const [records, setRecords] = useState<RecordListItem[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chartDate = datesByPeriod[period];
  const handleDateChange = (d: Date) => {
    setDatesByPeriod((prev) => ({ ...prev, [period]: d }));
  };

  useEffect(() => {
    let cancelled = false;
    setStatsLoading(true);
    setError(null);
    getRecordStats({
      type: CATEGORY_TO_TYPE[category],
      period: PERIOD_TO_PARAM[period],
      date: toDateParam(chartDate),
    })
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((e) => {
        if (!cancelled) {
          console.error('[StatsPage] getRecordStats failed:', e);
          setError('통계를 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category, period, chartDate]);

  useEffect(() => {
    let cancelled = false;
    setRecordsLoading(true);
    getRecords()
      .then((data) => {
        if (!cancelled) setRecords(data);
      })
      .catch((e) => {
        if (!cancelled) {
          console.error('[StatsPage] getRecords failed:', e);
        }
      })
      .finally(() => {
        if (!cancelled) setRecordsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const chartData = useMemo<ChartDataPoint[]>(
    () =>
      stats.breakdown.map((b) => ({
        x: b.index,
        value: b.distanceKm,
        label: b.label,
      })),
    [stats.breakdown],
  );

  // 전체/연도 차트 시작점을 사용자가 처음 뛴 해로 맞춘다. 기록이 없으면 올해.
  const firstYear = useMemo(() => {
    if (records.length === 0) return new Date().getFullYear();
    const years = records
      .map((r) => new Date(r.date).getFullYear())
      .filter((y) => Number.isFinite(y));
    return years.length ? Math.min(...years) : new Date().getFullYear();
  }, [records]);

  return (
    <div className="flex flex-col gap-2 pt-3">
      <TabSelector
        tabs={STATS_TABS}
        activeKey={category}
        onChange={setCategory}
      />

      <PeriodSelector value={period} onChange={setPeriod} />

      {error ? (
        <p className="mt-10 self-center text-body-sm text-status-error">
          {error}
        </p>
      ) : (
        <StatsChart
          period={period}
          date={chartDate}
          joinYear={firstYear}
          onDateChange={handleDateChange}
          totalDistanceKm={stats.totalDistanceKm}
          runCount={stats.runCount}
          avgPace={stats.avgPace}
          totalDurationSec={stats.totalDurationSec}
          data={chartData}
        />
      )}

      <section className="mt-6 flex flex-col gap-3 pb-[100px]">
        <h2 className="text-h2 font-bold text-text-primary">최근 활동</h2>
        {recordsLoading ? (
          <p className="self-center py-6 text-body-sm text-gray-500">
            불러오는 중...
          </p>
        ) : records.length === 0 ? (
          <p className="self-center py-6 text-body-sm text-gray-500">
            러닝 기록이 아직 없습니다
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {records.map((r) => (
              <li key={r.runId}>
                <RecordCard
                  data={{
                    courseName: r.courseName,
                    date: r.date,
                    distanceKm: r.distanceKm,
                    durationSec: r.durationSec,
                    avgPace: r.avgPace,
                    coursePath: r.coursePath,
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <TabBarLayout activeTab="stats" />

      {statsLoading && (
        <p className="sr-only" aria-live="polite">
          통계 불러오는 중...
        </p>
      )}
    </div>
  );
}
