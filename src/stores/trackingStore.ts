import { create } from 'zustand';

/**
 * 러닝 종료 시점의 기록 요약을 담는 저장소.
 * TrackingActive 에서 계산한 값을 저장하고, TrackingDone 에서 읽어 보여준다.
 */
export type RunSummary = {
  courseName: string;
  distanceKm: number;
  elapsedSec: number;
  speedKmh: number;
  /** 실제 이동 경로(GPS 좌표 배열) */
  trackedPath: { lat: number; lng: number }[];
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
