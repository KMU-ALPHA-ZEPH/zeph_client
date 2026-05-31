import api from '@/lib/axios';

/**
 * AI 코스 추천 API 레이어.
 *
 * 백엔드: POST /v0/courses/recommend
 *  - Swagger: https://api.kmuzeph.site/swagger-ui/index.html#/courses/recommendCourse
 *
 * 프런트의 선택값(한국어 라벨/내부 키)을 백엔드가 기대하는 문자열로
 * 변환하는 매핑(toCourseType / toSlopePreference)을 한곳에 모아두었어요.
 * 실제 백엔드가 받는 enum 값이 다르면 이 두 매핑만 고치면 됩니다.
 */

/** 추천 요청 바디 (RecommendCourseRequest) */
export type RecommendCourseRequest = {
  distanceKm: number;
  type: string;
  roundTrip: boolean;
  startLat: number;
  startLng: number;
  preferLighting: boolean;
  preferConvenience: boolean;
  slopePreference: string;
  prompt: string;
};

/** 경로 한 점의 구간 정보 (SegmentInfo) */
export type SegmentInfo = {
  lengthM?: number;
  avgBrightness?: number;
  slopeType?: string;
  nearPark?: boolean;
  trafficlightCount?: number;
  trafficVolumeScore?: number;
};

/** 경로 좌표 한 점 (Point) */
export type CoursePoint = {
  id?: number;
  lat: number;
  lng: number;
  segmentToNext?: SegmentInfo;
};

/** 경로 좌표 묶음 (PathData) */
export type PathData = {
  points: CoursePoint[];
};

/** 추천 응답 바디 (RecommendCourseResponse) */
export type RecommendCourseResponse = {
  requestedDistanceKm?: number;
  totalDistanceKm?: number;
  type?: string;
  roundTrip?: boolean;
  startLat?: number;
  startLng?: number;
  pathData?: PathData;
};

/**
 * 프런트 코스 유형 키 → 백엔드 course_type 문자열
 *  - exercise(운동): 횡단보도 최소
 *  - walk(산책): 공원/편의시설 위주
 *  - safety(안전): 교통량 적은 쪽
 */
export function toCourseType(
  courseType: 'workout' | 'walk' | 'safety' | null,
): string {
  switch (courseType) {
    case 'walk':
      return 'walk';
    case 'safety':
      return 'safety';
    case 'workout':
    default:
      return 'exercise';
  }
}

/** 프런트 경사 키 → 백엔드 slope_preference 문자열 (low/medium/high) */
export function toSlopePreference(
  slope: 'low' | 'normal' | 'high' | null,
): string {
  switch (slope) {
    case 'low':
      return 'low';
    case 'high':
      return 'high';
    case 'normal':
    default:
      return 'medium';
  }
}

/**
 * AI 추천 코스를 요청한다.
 * 성공 시 pathData.points 에 추천 경로 좌표 배열이 담겨 온다.
 * signal 을 넘기면 사용자가 도중에 취소할 수 있다(AbortController).
 */
export async function recommendCourse(
  body: RecommendCourseRequest,
  signal?: AbortSignal,
): Promise<RecommendCourseResponse> {
  const { data } = await api.post<RecommendCourseResponse>(
    '/v0/courses',
    body,
    {
      signal,
    },
  );
  return data;
}
