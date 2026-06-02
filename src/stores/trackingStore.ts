import { create } from 'zustand';

/**
 * 러닝 종료 시점의 기록 요약을 담는 저장소.
 * TrackingActive 에서 계산한 값을 저장하고, TrackingDone 에서 읽어 보여준다.
 */
export type TrackedPoint = {
  lat: number;
  lng: number;
  /** ISO 8601 — 백엔드 POST /v0/records 의 points[].recordedAt 와 동일 형식 */
  recordedAt: string;
};

export type RunSummary = {
  courseName: string;
  distanceKm: number;
  elapsedSec: number;
  speedKmh: number;
  /** 실제 이동 경로(GPS 좌표 배열, 표시용) */
  trackedPath: { lat: number; lng: number }[];
  /** 좌표별 타임스탬프 포함 (백엔드 기록 등록 전송용) */
  trackedPoints: TrackedPoint[];
  /** ISO 8601 — 러닝 시작 시각 */
  startTime: string;
  /** ISO 8601 — 러닝 종료 시각 */
  endTime: string;
  /** 일시정지 누적 시간(초) */
  pausedSec: number;
};

type TrackingState = {
  summary: RunSummary | null;
  setSummary: (summary: RunSummary) => void;
  reset: () => void;
};

export const useTrackingStore = create<TrackingState>((set) => ({
  summary: null,
  setSummary: (summary) => set({ summary }),
  reset: () => set({ summary: null }),
}));
