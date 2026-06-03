import { useEffect, useRef } from 'react';
import {
  useKakaoMaps,
  type KakaoMap,
  type KakaoCustomOverlay,
  type KakaoPolyline,
} from '@/hooks/useKakaoMaps';

// 현재 위치 마커 HTML (네이버 내비처럼 원형 점 + 펄스)
const CURRENT_DOT_HTML =
  '<div class="run-dot"><span class="run-dot__pulse"></span><span class="run-dot__core"></span></div>';

export type LatLng = { lat: number; lng: number };

/** 색을 달리해서 그릴 세그먼트 한 조각. path 는 보통 2개의 점([from, to]). */
export type ColoredSegment = { path: LatLng[]; color: string };

type CourseMapProps = {
  /** AI 추천 경로 — primary 색, 얇고 반투명하게 그린다. */
  recommendedPath?: LatLng[];
  /** segment 별 색을 직접 지정해서 그릴 때 사용. 있으면 recommendedPath 대신 이걸 그린다. */
  coloredSegments?: ColoredSegment[];
  /** 공원 근처 표시용 마커 위치(좌표). 단순 점으로만 표시. */
  parkMarkers?: LatLng[];
  /** 실제 이동 경로 — 진한 색, 더 두껍게 그린다. */
  trackedPath?: LatLng[];
  /** 현재 위치 마커 */
  currentPosition?: LatLng | null;
  /** recommendedPath 전체가 보이도록 한 번 화면을 맞춘다. */
  fitToRecommended?: boolean;
  /** currentPosition 이 바뀔 때 지도를 그 위치로 따라가게 할지 (러닝 중에만 true) */
  followCurrent?: boolean;
  /** 추천 경로에 맞춘 뒤 추가로 줌인할 레벨 수 (러닝 중 살짝 더 확대용) */
  zoomInLevels?: number;
  /** 지도 밝기: light(원본) / dim(살짝 어둡게) / dark(중간 어둡게) */
  theme?: 'light' | 'dim' | 'dark';
  className?: string;
};

const NEON = '#17e39c'; // 추천 경로 — 형광 민트그린
const TRACKED = '#ffffff'; // 실제 이동 경로 — 어두운 지도 위 대비용 흰색
const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.978 }; // 서울시청

/**
 * 카카오맵 위에 추천 경로 / 실제 이동 경로 / 현재 위치 마커를 그리는 공용 지도.
 *
 * 명령형(kakao SDK)인 지도 객체를 ref 로 들고,
 * props 가 바뀔 때마다 Polyline.setPath / Marker.setPosition 으로 갱신한다.
 */
export default function CourseMap({
  recommendedPath,
  coloredSegments,
  parkMarkers,
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
  // 매 갱신마다 이전 세그먼트/마커는 지운 뒤 다시 그린다.
  const segmentLinesRef = useRef<KakaoPolyline[]>([]);
  const parkOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const fittedRef = useRef(false);
  const { ready, error } = useKakaoMaps();

  // 1) 지도 + 두 개의 Polyline 초기화 (최초 1회)
  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const { kakao } = window;

    const first = recommendedPath?.[0] ?? currentPosition ?? DEFAULT_CENTER;
    mapRef.current = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(first.lat, first.lng),
      level: 4,
    });

    // 추천 경로: 형광 민트그린, 두껍게(8), 선명하게
    recommendedLineRef.current = new kakao.maps.Polyline({
      path: [],
      strokeWeight: 5,
      strokeColor: NEON,
      strokeOpacity: 0.95,
      strokeStyle: 'solid',
      map: mapRef.current,
    });

    // 실제 이동 경로: 어두운 지도 위 대비를 위해 흰색, 더 두껍게(9)
    trackedLineRef.current = new kakao.maps.Polyline({
      path: [],
      strokeWeight: 3,
      strokeColor: TRACKED,
      strokeOpacity: 0.95,
      strokeStyle: 'solid',
      map: mapRef.current,
    });
  }, [ready, recommendedPath, currentPosition]);

  // 2) 추천 경로 갱신 + 화면 맞춤
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
      // 경로에 맞춘 뒤 살짝 더 확대 (레벨 숫자가 작을수록 확대)
      if (zoomInLevels > 0) {
        map.setLevel(Math.max(1, map.getLevel() - zoomInLevels));
      }
      fittedRef.current = true;
    }
  }, [ready, recommendedPath, fitToRecommended, zoomInLevels]);

  // 3) 실제 이동 경로 갱신
  useEffect(() => {
    const { kakao } = window;
    const line = trackedLineRef.current;
    if (!ready || !line || !trackedPath) return;
    line.setPath(trackedPath.map((p) => new kakao.maps.LatLng(p.lat, p.lng)));
  }, [ready, trackedPath]);

  // 3-1) 색을 분리한 segment 라인 그리기 (있을 때만). recommendedLine 은 숨긴다.
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map) return;
    const { kakao } = window;

    // 기존 segment 라인 제거
    segmentLinesRef.current.forEach((l) => l.setMap(null));
    segmentLinesRef.current = [];

    if (!coloredSegments || coloredSegments.length === 0) {
      // segment 모드 해제 — 기본 recommendedLine 다시 노출
      recommendedLineRef.current?.setMap(map);
      return;
    }

    // segment 모드 — 단색 추천 라인 숨김
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

  // 3-2) 공원 마커
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

  // 4) 현재 위치 마커 갱신 + 따라가기
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
