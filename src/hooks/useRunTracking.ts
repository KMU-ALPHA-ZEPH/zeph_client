import { useCallback, useEffect, useRef, useState } from 'react';
import type { LatLng } from '@/components/CourseMap';
import { haversineMeters } from '@/utils/geo';

/** GPS 떨림으로 인한 미세 이동은 거리에 더하지 않는다(m) */
const MIN_STEP_M = 3;

export type TrackedPoint = LatLng & { recordedAt: string };

export type RunTracking = {
  /** 실제 이동 경로 좌표 배열 */
  trackedPath: LatLng[];
  /** 같은 경로의 좌표별 타임스탬프 포함 버전 (백엔드 전송용) */
  trackedPoints: TrackedPoint[];
  /** 현재 위치 */
  position: LatLng | null;
  /** 누적 이동 거리(km) */
  distanceKm: number;
  /** GPS 수신 여부 */
  hasFix: boolean;
};

/**
 * 현재 위치를 추적해 경로/거리를 누적한다.
 *
 * @param running       true 일 때만 위치를 받아 누적한다(일시정지 시 false).
 * @param simulatePath  지정하면 실제 GPS 대신 이 경로를 따라 이동을 시뮬레이션한다.
 *                      (데스크톱에서 러닝 흐름을 확인할 때 사용 — devSim 참고)
 */
export function useRunTracking(
  running: boolean,
  simulatePath?: LatLng[] | null,
): RunTracking {
  const [trackedPath, setTrackedPath] = useState<LatLng[]>([]);
  const [trackedPoints, setTrackedPoints] = useState<TrackedPoint[]>([]);
  const [position, setPosition] = useState<LatLng | null>(null);
  const [distanceKm, setDistanceKm] = useState(0);
  const [hasFix, setHasFix] = useState(false);

  // 직전 좌표 — 거리 증분 계산용. 일시정지/재개 시 점프 방지를 위해 ref 로 관리.
  const lastPointRef = useRef<LatLng | null>(null);

  // 새 좌표 수신 공통 처리(실제 GPS / 시뮬 둘 다 사용)
  const pushPosition = useCallback((next: LatLng) => {
    setHasFix(true);
    setPosition(next);

    const prev = lastPointRef.current;
    if (prev) {
      const stepM = haversineMeters(prev, next);
      if (stepM >= MIN_STEP_M) {
        setDistanceKm((d) => d + stepM / 1000);
        setTrackedPath((path) => [...path, next]);
        lastPointRef.current = next;
      }
    } else {
      setTrackedPath((path) => [...path, next]);
      lastPointRef.current = next;
    }
  }, []);

  const simulating = !!simulatePath && simulatePath.length > 1;

  // 실제 GPS 추적
  useEffect(() => {
    if (!running || simulating) return;
    if (!navigator.geolocation) return;

    // 재개 시점: 다음 좌표가 첫 점이 되도록 초기화(멈춰 있던 구간을 거리에 더하지 않음)
    lastPointRef.current = null;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const next: LatLng = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        const recordedAt = new Date().toISOString();
        setHasFix(true);
        setPosition(next);

        const prev = lastPointRef.current;
        if (prev) {
          const stepM = haversineMeters(prev, next);
          if (stepM >= MIN_STEP_M) {
            setDistanceKm((d) => d + stepM / 1000);
            setTrackedPath((path) => [...path, next]);
            setTrackedPoints((arr) => [...arr, { ...next, recordedAt }]);
            lastPointRef.current = next;
          }
        } else {
          // 첫 좌표
          setTrackedPath((path) => [...path, next]);
          setTrackedPoints((arr) => [...arr, { ...next, recordedAt }]);
          lastPointRef.current = next;
        }
      },
      (err) => {
        console.warn('watchPosition failed', err);
      },

      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 },
    );

    return () => navigator.geolocation.clearWatch(id);
  }, [running, simulating, pushPosition]);

  // 시뮬레이션: 추천 경로를 따라 한 점씩 이동
  useEffect(() => {
    if (!running || !simulating || !simulatePath) return;
    lastPointRef.current = null;
    let i = 0;
    const id = setInterval(() => {
      pushPosition(simulatePath[i]);
      if (i < simulatePath.length - 1) i += 1;
    }, 600);
    return () => clearInterval(id);
  }, [running, simulating, simulatePath, pushPosition]);

  return { trackedPath, trackedPoints, position, distanceKm, hasFix };
}
