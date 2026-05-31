import { useEffect, useRef, useState } from 'react';
import type { LatLng } from '@/components/CourseMap';

/** 두 좌표 사이 거리(m) — Haversine 공식 */
function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** GPS 떨림으로 인한 미세 이동은 거리에 더하지 않는다(m) */
const MIN_STEP_M = 3;

export type RunTracking = {
  /** 실제 이동 경로 좌표 배열 */
  trackedPath: LatLng[];
  /** 현재 위치 */
  position: LatLng | null;
  /** 누적 이동 거리(km) */
  distanceKm: number;
  /** GPS 수신 여부 */
  hasFix: boolean;
};

/**
 * navigator.geolocation.watchPosition 으로 현재 위치를 추적한다.
 *
 * @param running true 일 때만 위치를 받아 경로/거리에 누적한다.
 *                (일시정지하면 false 로 내려 watch 를 멈춘다)
 */
export function useRunTracking(running: boolean): RunTracking {
  const [trackedPath, setTrackedPath] = useState<LatLng[]>([]);
  const [position, setPosition] = useState<LatLng | null>(null);
  const [distanceKm, setDistanceKm] = useState(0);
  const [hasFix, setHasFix] = useState(false);

  // 직전 좌표 — 거리 증분 계산용. 일시정지/재개 시 점프 방지를 위해 ref 로 관리.
  const lastPointRef = useRef<LatLng | null>(null);

  useEffect(() => {
    if (!running) return;
    if (!navigator.geolocation) return;

    // 재개 시점: 다음 좌표가 첫 점이 되도록 초기화(멈춰 있던 구간을 거리에 더하지 않음)
    lastPointRef.current = null;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const next: LatLng = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
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
          // 첫 좌표
          setTrackedPath((path) => [...path, next]);
          lastPointRef.current = next;
        }
      },
      (err) => {
        console.warn('watchPosition failed', err);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 },
    );

    return () => navigator.geolocation.clearWatch(id);
  }, [running]);

  return { trackedPath, position, distanceKm, hasFix };
}
