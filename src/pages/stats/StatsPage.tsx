import { useMemo, useState } from 'react';
import TabSelector, { type TabItem } from '@/components/common/TabSelector';
import PeriodSelector, { type Period } from '@/pages/stats/PeriodSelector';
import StatsChart, { type ChartDataPoint } from '@/pages/stats/StatsChart';
import RecordCard, { type RecordCardData } from '@/pages/stats/RecordCard';
import TabBarLayout from '@/components/layout/TabBarLayout';

type StatsCategory = 'walk' | 'workout' | 'general' | 'all';

const STATS_TABS: TabItem<StatsCategory>[] = [
  { key: 'walk', label: '산책 코스' },
  { key: 'workout', label: '운동 코스' },
  { key: 'general', label: '일반 코스' },
  { key: 'all', label: '전체 코스' },
];

type StatsData = {
  totalDistanceKm: number;
  runCount: number;
  avgPace: number;
  totalDurationSec: number;
  data: ChartDataPoint[];
};

const SAMPLE: Record<StatsCategory, Record<Period, StatsData>> = {
  walk: {
    week: {
      totalDistanceKm: 8.4,
      runCount: 4,
      avgPace: 540,
      totalDurationSec: 4500,
      data: [
        { x: 1, value: 1.5 },
        { x: 2, value: 2.3 },
        { x: 4, value: 1.8 },
        { x: 6, value: 2.8 },
      ],
    },
    month: {
      totalDistanceKm: 25.4,
      runCount: 10,
      avgPace: 510,
      totalDurationSec: 9290,
      data: [
        { x: 3, value: 3 },
        { x: 8, value: 5 },
        { x: 15, value: 4 },
        { x: 22, value: 6 },
        { x: 28, value: 7 },
      ],
    },
    year: {
      totalDistanceKm: 280.6,
      runCount: 105,
      avgPace: 520,
      totalDurationSec: 252000,
      data: [
        { x: 1, value: 18 },
        { x: 2, value: 22 },
        { x: 3, value: 26 },
        { x: 4, value: 30 },
        { x: 5, value: 34 },
        { x: 6, value: 28 },
        { x: 7, value: 24 },
        { x: 8, value: 22 },
        { x: 9, value: 26 },
        { x: 10, value: 24 },
      ],
    },
    all: {
      totalDistanceKm: 612.3,
      runCount: 220,
      avgPace: 525,
      totalDurationSec: 540000,
      data: [
        { x: 2024, value: 220 },
        { x: 2025, value: 270 },
        { x: 2026, value: 122 },
      ],
    },
  },
  workout: {
    week: {
      totalDistanceKm: 18.2,
      runCount: 3,
      avgPace: 330,
      totalDurationSec: 3600,
      data: [
        { x: 1, value: 6 },
        { x: 3, value: 5 },
        { x: 5, value: 7.2 },
      ],
    },
    month: {
      totalDistanceKm: 62.8,
      runCount: 12,
      avgPace: 340,
      totalDurationSec: 12800,
      data: [
        { x: 2, value: 7 },
        { x: 7, value: 5 },
        { x: 11, value: 8 },
        { x: 17, value: 6 },
        { x: 23, value: 9 },
        { x: 29, value: 7 },
      ],
    },
    year: {
      totalDistanceKm: 614.5,
      runCount: 130,
      avgPace: 350,
      totalDurationSec: 180000,
      data: [
        { x: 1, value: 45 },
        { x: 2, value: 52 },
        { x: 3, value: 60 },
        { x: 4, value: 65 },
        { x: 5, value: 70 },
        { x: 6, value: 58 },
        { x: 7, value: 50 },
        { x: 8, value: 48 },
        { x: 9, value: 55 },
        { x: 10, value: 62 },
      ],
    },
    all: {
      totalDistanceKm: 1320.7,
      runCount: 280,
      avgPace: 355,
      totalDurationSec: 380000,
      data: [
        { x: 2024, value: 480 },
        { x: 2025, value: 620 },
        { x: 2026, value: 220 },
      ],
    },
  },
  general: {
    week: {
      totalDistanceKm: 6.5,
      runCount: 3,
      avgPace: 420,
      totalDurationSec: 2700,
      data: [
        { x: 2, value: 2 },
        { x: 4, value: 2.5 },
        { x: 7, value: 2 },
      ],
    },
    month: {
      totalDistanceKm: 22.1,
      runCount: 10,
      avgPace: 430,
      totalDurationSec: 9500,
      data: [
        { x: 4, value: 3 },
        { x: 9, value: 4 },
        { x: 14, value: 3 },
        { x: 20, value: 5 },
        { x: 26, value: 7 },
      ],
    },
    year: {
      totalDistanceKm: 248.9,
      runCount: 110,
      avgPace: 435,
      totalDurationSec: 108000,
      data: [
        { x: 1, value: 20 },
        { x: 2, value: 18 },
        { x: 3, value: 24 },
        { x: 4, value: 28 },
        { x: 5, value: 32 },
        { x: 6, value: 30 },
        { x: 7, value: 22 },
        { x: 8, value: 20 },
        { x: 9, value: 28 },
        { x: 10, value: 26 },
      ],
    },
    all: {
      totalDistanceKm: 528.6,
      runCount: 235,
      avgPace: 440,
      totalDurationSec: 230000,
      data: [
        { x: 2024, value: 190 },
        { x: 2025, value: 245 },
        { x: 2026, value: 93 },
      ],
    },
  },
  all: {
    week: {
      totalDistanceKm: 33.1,
      runCount: 10,
      avgPace: 420,
      totalDurationSec: 10800,
      data: [
        { x: 1, value: 9.5 },
        { x: 2, value: 4.3 },
        { x: 3, value: 5 },
        { x: 4, value: 4.3 },
        { x: 5, value: 9.2 },
        { x: 6, value: 2.8 },
        { x: 7, value: 2 },
      ],
    },
    month: {
      totalDistanceKm: 110.3,
      runCount: 32,
      avgPace: 425,
      totalDurationSec: 31590,
      data: [
        { x: 2, value: 7 },
        { x: 4, value: 6 },
        { x: 8, value: 9 },
        { x: 11, value: 8 },
        { x: 15, value: 7 },
        { x: 20, value: 10 },
        { x: 23, value: 9 },
        { x: 26, value: 7 },
        { x: 28, value: 7 },
      ],
    },
    year: {
      totalDistanceKm: 1144.0,
      runCount: 345,
      avgPace: 430,
      totalDurationSec: 540000,
      data: [
        { x: 1, value: 83 },
        { x: 2, value: 92 },
        { x: 3, value: 110 },
        { x: 4, value: 123 },
        { x: 5, value: 136 },
        { x: 6, value: 116 },
        { x: 7, value: 96 },
        { x: 8, value: 90 },
        { x: 9, value: 109 },
        { x: 10, value: 112 },
      ],
    },
    all: {
      totalDistanceKm: 2461.6,
      runCount: 735,
      avgPace: 432,
      totalDurationSec: 1150000,
      data: [
        { x: 2024, value: 890 },
        { x: 2025, value: 1135 },
        { x: 2026, value: 435 },
      ],
    },
  },
};

const RECENT_RECORDS: Record<StatsCategory, RecordCardData[]> = {
  walk: [
    {
      courseName: '뚝섬 한강 공원',
      date: '2026-04-29T08:30:00',
      distanceKm: 1.81,
      durationSec: 766,
      avgPace: 424,
      coursePath: [{ lat: 37.5172, lng: 127.0473 }],
    },
    {
      courseName: '한강 잠수교 산책',
      date: '2026-04-26T18:10:00',
      distanceKm: 2.4,
      durationSec: 1080,
      avgPace: 450,
      coursePath: [{ lat: 37.5163, lng: 126.9952 }],
    },
  ],
  workout: [
    {
      courseName: '올림픽공원 인터벌',
      date: '2026-04-28T06:40:00',
      distanceKm: 6.2,
      durationSec: 1980,
      avgPace: 319,
      coursePath: [{ lat: 37.5202, lng: 127.1216 }],
    },
    {
      courseName: '남산 둘레길',
      date: '2026-04-25T07:20:00',
      distanceKm: 7.4,
      durationSec: 2520,
      avgPace: 340,
      coursePath: [{ lat: 37.5512, lng: 126.9882 }],
    },
  ],
  general: [
    {
      courseName: '서울숲 둘레',
      date: '2026-04-27T17:50:00',
      distanceKm: 3.2,
      durationSec: 1320,
      avgPace: 412,
      coursePath: [{ lat: 37.5444, lng: 127.0376 }],
    },
    {
      courseName: '응봉산 한바퀴',
      date: '2026-04-24T16:00:00',
      distanceKm: 2.7,
      durationSec: 1140,
      avgPace: 422,
      coursePath: [{ lat: 37.5489, lng: 127.0319 }],
    },
  ],
  all: [
    {
      courseName: '뚝섬 한강 공원',
      date: '2026-04-29T08:30:00',
      distanceKm: 1.81,
      durationSec: 766,
      avgPace: 424,
      coursePath: [{ lat: 37.5172, lng: 127.0473 }],
    },
    {
      courseName: '올림픽공원 인터벌',
      date: '2026-04-28T06:40:00',
      distanceKm: 6.2,
      durationSec: 1980,
      avgPace: 319,
      coursePath: [{ lat: 37.5202, lng: 127.1216 }],
    },
    {
      courseName: '서울숲 둘레',
      date: '2026-04-27T17:50:00',
      distanceKm: 3.2,
      durationSec: 1320,
      avgPace: 412,
      coursePath: [{ lat: 37.5444, lng: 127.0376 }],
    },
  ],
};

export default function StatsPage() {
  const [category, setCategory] = useState<StatsCategory>('walk');
  const [period, setPeriod] = useState<Period>('month');
  const [datesByPeriod, setDatesByPeriod] = useState<Record<Period, Date>>(
    () => ({
      week: new Date(),
      month: new Date(),
      year: new Date(),
      all: new Date(),
    }),
  );

  const chartDate = datesByPeriod[period];
  const handleDateChange = (d: Date) => {
    setDatesByPeriod((prev) => ({ ...prev, [period]: d }));
  };

  const stats = useMemo(() => SAMPLE[category][period], [category, period]);
  const recentRecords = RECENT_RECORDS[category];

  return (
    <div className="flex flex-col gap-2 pt-3">
      <TabSelector
        tabs={STATS_TABS}
        activeKey={category}
        onChange={setCategory}
      />

      <PeriodSelector value={period} onChange={setPeriod} />

      <StatsChart
        period={period}
        date={chartDate}
        onDateChange={handleDateChange}
        joinYear={2024}
        totalDistanceKm={stats.totalDistanceKm}
        runCount={stats.runCount}
        avgPace={stats.avgPace}
        totalDurationSec={stats.totalDurationSec}
        data={stats.data}
      />

      <section className="mt-6 flex flex-col gap-3 pb-[100px]">
        <h2 className="text-h2 font-bold text-text-primary">최근 활동</h2>
        <ul className="flex flex-col gap-3">
          {recentRecords.map((r, idx) => (
            <li key={`${r.courseName}-${idx}`}>
              <RecordCard data={r} />
            </li>
          ))}
        </ul>
      </section>

      <TabBarLayout activeTab="stats" />
    </div>
  );
}
