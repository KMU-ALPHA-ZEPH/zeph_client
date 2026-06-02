import api from '@/lib/axios';

export type LatLng = { lat: number; lng: number };

/** 러닝 기록 목록 (GET /v0/records) */
export type RecordListItem = {
  runId: number;
  date: string;
  courseName: string;
  distanceKm: number;
  durationSec: number;
  avgPace: number;
  coursePath: LatLng[];
  actualPath: LatLng[];
};

/** 러닝 기록 상세 (GET /v0/records/{recordId}) */
export type RecordDetailResponse = {
  runId: number;
  courseName: string;
  startTime: string;
  endTime: string;
  distanceKm: number;
  durationSec: number;
  avgPace: number;
  memo?: string;
  scrapped?: boolean;
  liked?: boolean;
  coursePath: LatLng[];
  actualPath: LatLng[];
};

export type RecordStatsType = 'walk' | 'safety' | 'exercise';
export type RecordStatsPeriod = 'WEEK' | 'MONTH' | 'YEAR' | 'ALL';

export type RecordStatsParams = {
  type?: RecordStatsType;
  period?: RecordStatsPeriod;
  /** yyyy-MM-dd */
  date?: string;
};

/** 러닝 통계 응답 (GET /v0/records/stats) */
export type RecordStatsResponse = {
  runCount: number;
  avgPace: number;
  totalDurationSec: number;
  totalDistanceKm: number;
  breakdown: { index: number; label: string; distanceKm: number }[];
};

/** 러닝 기록 등록 요청 (POST /v0/records) */
export type CreateRecordRequest = {
  courseId: number;
  startTime: string;
  endTime: string;
  distanceKm: number;
  durationSec: number;
  pausedSec: number;
  points: { lat: number; lng: number; recordedAt: string }[];
  pausedSecValid: boolean;
  timeRangeValid: boolean;
};

export async function getRecords(): Promise<RecordListItem[]> {
  const { data } = await api.get<RecordListItem[]>('/v0/records');
  return data;
}

export async function getRecordDetail(
  recordId: number,
): Promise<RecordDetailResponse> {
  const { data } = await api.get<RecordDetailResponse>(
    `/v0/records/${recordId}`,
  );
  return data;
}

export async function getRecordStats(
  params: RecordStatsParams = {},
): Promise<RecordStatsResponse> {
  const { data } = await api.get<RecordStatsResponse>('/v0/records/stats', {
    params,
  });
  return data;
}

export async function createRecord(body: CreateRecordRequest): Promise<void> {
  await api.post('/v0/records', body);
}
