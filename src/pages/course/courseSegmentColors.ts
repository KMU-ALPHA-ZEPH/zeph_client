import type { CoursePoint } from '@/apis/courses';
import type { ColoredSegment } from '@/components/CourseMap';
import { haversineMeters } from '@/utils/geo';

type LatLng = { lat: number; lng: number };

/** 클러스터링 임계 거리 — 이 거리 이내의 공원 마커는 하나로 합친다. */
const PARK_CLUSTER_RADIUS_M = 150;

/** 경사도 별 색상 */
const SLOPE_COLOR: Record<string, string> = {
  flat: '#17e39c', // 평지 — 민트
  uphill: '#ff7d4a', // 오르막 — 주황
  downhill: '#4aa9ff', // 내리막 — 파랑
};
const SLOPE_DEFAULT = '#17e39c';

/** 안전도 3단계 색상 (안전 / 보통 / 주의) */
const SAFETY_HIGH = '#17e39c'; // 안전 — 초록
const SAFETY_MID = '#ffb547'; // 보통 — 주황
const SAFETY_LOW = '#ff5c5c'; // 주의 — 빨강

/**
 * 한 segment 의 안전도 점수(0~1). 클수록 안전.
 * - 밝기 가산
 * - 교통량은 적을수록 가산(1 - score)
 * - 신호등 개수도 약간 가산 (최대 3개로 정규화)
 */
function safetyScore(segment: {
  avgBrightness?: number;
  trafficVolumeScore?: number;
  trafficlightCount?: number;
}): number {
  const brightness = segment.avgBrightness ?? 0;
  const traffic = segment.trafficVolumeScore ?? 0;
  const lights = Math.min((segment.trafficlightCount ?? 0) / 3, 1);
  return brightness * 0.45 + (1 - traffic) * 0.4 + lights * 0.15;
}

function safetyColor(segment: {
  avgBrightness?: number;
  trafficVolumeScore?: number;
  trafficlightCount?: number;
}): string {
  const s = safetyScore(segment);
  if (s >= 0.6) return SAFETY_HIGH;
  if (s >= 0.3) return SAFETY_MID;
  return SAFETY_LOW;
}

/**
 * pathData.points 배열을 받아 각 segment 를 모드에 따라 색 매핑한다.
 * 각 segment 는 [points[i], points[i+1]] 두 점으로 구성.
 */
export function buildColoredSegments(
  points: CoursePoint[] | undefined,
  mode: 'slope' | 'safety',
): ColoredSegment[] {
  if (!points || points.length < 2) return [];
  const segments: ColoredSegment[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const seg = a.segmentToNext;
    const color =
      mode === 'slope'
        ? (SLOPE_COLOR[seg?.slopeType ?? ''] ?? SLOPE_DEFAULT)
        : safetyColor(seg ?? {});
    segments.push({
      path: [
        { lat: a.lat, lng: a.lng },
        { lat: b.lat, lng: b.lng },
      ],
      color,
    });
  }
  return segments;
}

/**
 * nearPark = true 인 segment 의 중점 좌표 목록.
 * 좁은 구간에 마커가 따닥따닥 붙는 걸 막기 위해 PARK_CLUSTER_RADIUS_M 이내는
 * 하나의 클러스터로 합쳐 평균 좌표 하나만 반환한다.
 */
export function buildParkMarkers(points: CoursePoint[] | undefined): LatLng[] {
  if (!points || points.length < 2) return [];
  const raw: LatLng[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const seg = points[i].segmentToNext;
    if (!seg?.nearPark) continue;
    const a = points[i];
    const b = points[i + 1];
    raw.push({
      lat: (a.lat + b.lat) / 2,
      lng: (a.lng + b.lng) / 2,
    });
  }
  if (raw.length === 0) return [];

  const clusters: LatLng[][] = [];
  for (const point of raw) {
    const target = clusters.find((cluster) =>
      cluster.some(
        (member) => haversineMeters(member, point) <= PARK_CLUSTER_RADIUS_M,
      ),
    );
    if (target) target.push(point);
    else clusters.push([point]);
  }

  return clusters.map((cluster) => {
    const sumLat = cluster.reduce((acc, p) => acc + p.lat, 0);
    const sumLng = cluster.reduce((acc, p) => acc + p.lng, 0);
    return {
      lat: sumLat / cluster.length,
      lng: sumLng / cluster.length,
    };
  });
}
