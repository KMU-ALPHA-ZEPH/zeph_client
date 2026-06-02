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

/**
 * 응답 좌표 한 점에서 lat/lng 를 견고하게 추출한다.
 * 백엔드/AI 가 키 이름을 다르게 줄 수 있어(lat/latitude/y, lng/lon/longitude/x)
 * 여러 후보를 시도하고, 숫자로 변환 가능한 유효 좌표만 반환한다.
 */
export function extractLatLng(p: unknown): { lat: number; lng: number } | null {
  if (!p || typeof p !== 'object') return null;
  const o = p as Record<string, unknown>;
  const lat = Number(o.lat ?? o.latitude ?? o.y);
  const lng = Number(o.lng ?? o.lon ?? o.longitude ?? o.x);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat === 0 && lng === 0) return null; // (0,0) 은 미설정으로 간주
  return { lat, lng };
}

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

/** 기존 코스 상세 (CourseDetailResponse) */
export type CourseDetailResponse = {
  id: number;
  type: string;
  distanceKm: number;
  startLat: number;
  startLng: number;
  pathData: PathData;
  name?: string;
  description?: string;
  likeCount?: number;
  isLiked?: boolean;
};

export async function getCourseDetail(
  courseId: number,
): Promise<CourseDetailResponse> {
  const { data } = await api.get<CourseDetailResponse>(
    `/v0/courses/${courseId}`,
  );
  return data;
}

export type UpdateCourseRequest = {
  name?: string;
  description?: string;
};

export async function updateCourse(
  courseId: number,
  body: UpdateCourseRequest,
): Promise<void> {
  await api.patch(`/v0/courses/${courseId}`, body);
}

/** 코스 목록 (CourseResponse) */
export type CourseListItem = {
  id: number;
  name: string;
  description?: string;
  type: string;
  roundTrip: boolean;
  region: string;
  likeCount: number;
  isLiked?: boolean;
  createdAt?: string;
};

/**
 * 추천 코스를 백엔드에 영구 저장한다.
 * - POST /v0/courses/save
 * - 응답의 id 는 이후 likeCourse/unlikeCourse 등 코스 식별이 필요한 API 호출에 사용한다.
 */
export async function saveCourse(body: {
  name: string;
  description?: string;
  type: string;
  distanceKm: number;
  pathData: PathData;
  roundTrip: boolean;
  preferLighting: boolean;
  preferConvenience: boolean;
  slopePreference: string;
}): Promise<{ id: number }> {
  const { data } = await api.post<{ id: number }>('/v0/courses/save', body);
  return data;
}

export type GetCoursesParams = {
  sort?: 'NEAREST' | 'POPULAR' | 'LATEST';
  lat?: number;
  lng?: number;
  radiusKm?: number;
  minDistanceKm?: number;
  maxDistanceKm?: number;
  type?: 'walk' | 'safety' | 'exercise' | 'workout';
  liked?: boolean;
};

export async function getCourses(
  params: GetCoursesParams = {},
): Promise<CourseListItem[]> {
  const { data } = await api.get<CourseListItem[]>('/v0/courses', { params });
  return data;
}
