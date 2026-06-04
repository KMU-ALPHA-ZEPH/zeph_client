import { useEffect, useRef } from 'react';
import {
  useKakaoMaps,
  type KakaoMap,
  type KakaoCustomOverlay,
  type KakaoPolyline,
} from '@/hooks/useKakaoMaps';

const CURRENT_DOT_HTML =
  '<div class="run-dot"><span class="run-dot__pulse"></span><span class="run-dot__core"></span></div>';

export type LatLng = { id?: number; lat: number; lng: number };
export type ColoredSegment = { path: LatLng[]; color: string };

type CourseMapProps = {
  recommendedPath?: LatLng[];
  coloredSegments?: ColoredSegment[];
  parkMarkers?: LatLng[];
  showEndpoints?: boolean;
  trackedPath?: LatLng[];
  currentPosition?: LatLng | null;
  fitToRecommended?: boolean;
  followCurrent?: boolean;
  zoomInLevels?: number;
  theme?: 'light' | 'dim' | 'dark';
  className?: string;
};

const NEON = '#17e39c';
const TRACKED = '#ffffff';
const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.978 };

const ARROW_SPACING_M = 35;
const ARROW_SIZE_PX = 8;

function haversineMeters(a: LatLng, b: LatLng) {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

function interpolatePoint(a: LatLng, b: LatLng, ratio: number): LatLng {
  return {
    lat: a.lat + (b.lat - a.lat) * ratio,
    lng: a.lng + (b.lng - a.lng) * ratio,
  };
}

function getAngle(a: LatLng, b: LatLng) {
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;

  // ➤ 기본 방향이 오른쪽(→)이라서 atan2(dy, dx) 기준으로 회전
  return -Math.atan2(dy, dx) * (180 / Math.PI);
}

export default function CourseMap({
  recommendedPath,
  coloredSegments,
  parkMarkers,
  showEndpoints = false,
  trackedPath,
  currentPosition,
  fitToRecommended = true,
  followCurrent = true,
  zoomInLevels = 0,
  theme = 'dark',
  className,
}: CourseMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const recommendedLineRef = useRef<KakaoPolyline | null>(null);
  const trackedLineRef = useRef<KakaoPolyline | null>(null);
  const markerRef = useRef<KakaoCustomOverlay | null>(null);

  const segmentLinesRef = useRef<KakaoPolyline[]>([]);
  const parkOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const endpointOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const arrowOverlaysRef = useRef<KakaoCustomOverlay[]>([]);

  const fittedRef = useRef(false);
  const { ready, error } = useKakaoMaps();

  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;

    const { kakao } = window;
    const first = recommendedPath?.[0] ?? currentPosition ?? DEFAULT_CENTER;

    mapRef.current = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(first.lat, first.lng),
      level: 4,
    });

    recommendedLineRef.current = new kakao.maps.Polyline({
      path: [],
      strokeWeight: 5,
      strokeColor: NEON,
      strokeOpacity: 0.95,
      strokeStyle: 'solid',
      map: mapRef.current,
    });

    trackedLineRef.current = new kakao.maps.Polyline({
      path: [],
      strokeWeight: 3,
      strokeColor: TRACKED,
      strokeOpacity: 0.95,
      strokeStyle: 'solid',
      map: mapRef.current,
    });
  }, [ready, recommendedPath, currentPosition]);

  useEffect(() => {
    const { kakao } = window;
    const map = mapRef.current;
    const line = recommendedLineRef.current;

    if (!ready || !map || !line || !recommendedPath?.length) return;

    const path = recommendedPath.map(
      (p) => new kakao.maps.LatLng(p.lat, p.lng),
    );

    line.setPath(path);

    if (fitToRecommended && !fittedRef.current) {
      const bounds = new kakao.maps.LatLngBounds();
      path.forEach((latLng) => bounds.extend(latLng));
      map.setBounds(bounds);

      if (zoomInLevels > 0) {
        map.setLevel(Math.max(1, map.getLevel() - zoomInLevels));
      }

      fittedRef.current = true;
    }
  }, [ready, recommendedPath, fitToRecommended, zoomInLevels]);

  useEffect(() => {
    if (!ready) return;

    const map = mapRef.current;
    if (!map) return;

    const { kakao } = window;

    arrowOverlaysRef.current.forEach((o) => o.setMap(null));
    arrowOverlaysRef.current = [];

    const segmentPoints = coloredSegments?.flatMap((s) => s.path) ?? [];
    const pts =
      segmentPoints.length > 0 ? segmentPoints : (recommendedPath ?? []);

    if (pts.length < 2) return;

    const makeArrow = (angle: number) => `
      <div style="
        width:${ARROW_SIZE_PX}px;
        height:${ARROW_SIZE_PX}px;
        display:flex;
        align-items:center;
        justify-content:center;
        transform:rotate(${angle}deg);
        color:rgba(235,255,250,0.95);
        font-size:${ARROW_SIZE_PX}px;
        font-weight:900;
        line-height:1;
        text-shadow:0 1px 2px rgba(0,0,0,0.35);
        pointer-events:none;
      ">
        ➤
      </div>
    `;

    let distanceFromLastArrow = 0;

    for (let i = 0; i < pts.length - 1; i += 1) {
      const from = pts[i];
      const to = pts[i + 1];

      const segmentLength = haversineMeters(from, to);
      if (segmentLength <= 0) continue;

      const angle = getAngle(from, to);
      let cursor = ARROW_SPACING_M - distanceFromLastArrow;

      while (cursor < segmentLength) {
        const ratio = cursor / segmentLength;
        const point = interpolatePoint(from, to, ratio);

        const overlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(point.lat, point.lng),
          content: makeArrow(angle),
          xAnchor: 0.5,
          yAnchor: 0.5,
          zIndex: 7,
          map,
        });

        arrowOverlaysRef.current.push(overlay);
        cursor += ARROW_SPACING_M;
      }

      distanceFromLastArrow =
        cursor - segmentLength === ARROW_SPACING_M
          ? 0
          : ARROW_SPACING_M - (cursor - segmentLength);
    }
  }, [ready, recommendedPath, coloredSegments]);

  useEffect(() => {
    const { kakao } = window;
    const line = trackedLineRef.current;

    if (!ready || !line || !trackedPath) return;

    line.setPath(trackedPath.map((p) => new kakao.maps.LatLng(p.lat, p.lng)));
  }, [ready, trackedPath]);

  useEffect(() => {
    if (!ready) return;

    const map = mapRef.current;
    if (!map) return;

    const { kakao } = window;

    segmentLinesRef.current.forEach((l) => l.setMap(null));
    segmentLinesRef.current = [];

    if (!coloredSegments || coloredSegments.length === 0) {
      recommendedLineRef.current?.setMap(map);
      return;
    }

    recommendedLineRef.current?.setMap(null);

    coloredSegments.forEach((seg) => {
      if (seg.path.length < 2) return;

      const path = seg.path.map((p) => new kakao.maps.LatLng(p.lat, p.lng));

      const line = new kakao.maps.Polyline({
        path,
        strokeWeight: 5,
        strokeColor: seg.color,
        strokeOpacity: 0.95,
        strokeStyle: 'solid',
        map,
      });

      segmentLinesRef.current.push(line);
    });

    if (fitToRecommended && !fittedRef.current) {
      const bounds = new kakao.maps.LatLngBounds();

      coloredSegments.forEach((seg) =>
        seg.path.forEach((p) =>
          bounds.extend(new kakao.maps.LatLng(p.lat, p.lng)),
        ),
      );

      map.setBounds(bounds);

      if (zoomInLevels > 0) {
        map.setLevel(Math.max(1, map.getLevel() - zoomInLevels));
      }

      fittedRef.current = true;
    }
  }, [ready, coloredSegments, fitToRecommended, zoomInLevels]);

  useEffect(() => {
    if (!ready) return;

    const map = mapRef.current;
    if (!map) return;

    const { kakao } = window;

    endpointOverlaysRef.current.forEach((o) => o.setMap(null));
    endpointOverlaysRef.current = [];

    if (!showEndpoints) return;

    const segmentPoints = coloredSegments?.flatMap((s) => s.path) ?? [];
    const pts =
      segmentPoints.length > 0 ? segmentPoints : (recommendedPath ?? []);

    if (pts.length < 1) return;

    const makeDot = (label: 'S' | 'E', bg: string) =>
      `<div style="width:24px;height:24px;border-radius:50%;background:${bg};color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35);">${label}</div>`;

    const start = pts[0];

    endpointOverlaysRef.current.push(
      new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(start.lat, start.lng),
        content: makeDot('S', '#2ed973'),
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 8,
        map,
      }),
    );

    if (pts.length > 1) {
      const end = pts[pts.length - 1];

      endpointOverlaysRef.current.push(
        new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(end.lat, end.lng),
          content: makeDot('E', '#ff5c5c'),
          xAnchor: 0.5,
          yAnchor: 0.5,
          zIndex: 8,
          map,
        }),
      );
    }
  }, [ready, showEndpoints, recommendedPath, coloredSegments]);

  useEffect(() => {
    if (!ready) return;

    const map = mapRef.current;
    if (!map) return;

    const { kakao } = window;

    parkOverlaysRef.current.forEach((o) => o.setMap(null));
    parkOverlaysRef.current = [];

    if (!parkMarkers || parkMarkers.length === 0) return;

    parkMarkers.forEach((p) => {
      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(p.lat, p.lng),
        content:
          '<div style="width:20px;height:20px;border-radius:50%;background:#2ed973;color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);">P</div>',
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 5,
        map,
      });

      parkOverlaysRef.current.push(overlay);
    });
  }, [ready, parkMarkers]);

  useEffect(() => {
    const { kakao } = window;
    const map = mapRef.current;

    if (!ready || !map || !currentPosition) return;

    const latLng = new kakao.maps.LatLng(
      currentPosition.lat,
      currentPosition.lng,
    );

    if (markerRef.current) {
      markerRef.current.setPosition(latLng);
    } else {
      markerRef.current = new kakao.maps.CustomOverlay({
        position: latLng,
        content: CURRENT_DOT_HTML,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 10,
        map,
      });
    }

    if (followCurrent) map.panTo(latLng);
  }, [ready, currentPosition, followCurrent]);

  return (
    <div className={className ?? 'absolute inset-0'}>
      <div
        ref={containerRef}
        className={
          theme === 'dim'
            ? 'map-dim size-full'
            : theme === 'dark'
              ? 'map-dark size-full'
              : 'size-full'
        }
      />

      {error && (
        <div className="absolute inset-0 grid place-items-center bg-gray-100 px-6 text-center text-[13px] text-gray-500">
          지도를 불러올 수 없습니다.
        </div>
      )}
    </div>
  );
}
