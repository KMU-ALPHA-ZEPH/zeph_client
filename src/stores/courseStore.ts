import { create } from 'zustand';
import {
  toCourseType,
  toSlopePreference,
  type RecommendCourseRequest,
  type RecommendCourseResponse,
} from '@/apis/courses';

/**
 * 코스 생성 플로우(step01~03 → loading → detail)에서
 * 페이지 간에 공유되는 상태 저장소.
 *
 * - form  : 사용자가 각 스텝에서 고른 선호 조건 + 시작 위치
 * - result: 백엔드가 돌려준 추천 코스(추천 경로 좌표 포함)
 *
 * 각 스텝 페이지는 자신이 고른 값만 store 에 써 두고,
 * CourseLoadingPage 에서 form 을 모아 recommend API 를 호출한다.
 */

export type CourseForm = {
  startName: string;
  startAddress: string;
  startLat: number | null;
  startLng: number | null;
  distanceKm: number | null;
  roundTrip: boolean | null; // 왕복 true / 편도 false
  courseType: 'workout' | 'walk' | 'safety' | null;
  lighting: 'bright' | 'any' | null;
  slope: 'low' | 'normal' | 'high' | null;
  facility: 'prefer' | 'none' | null;
  prompt: string;
};

const initialForm: CourseForm = {
  startName: '',
  startAddress: '',
  startLat: null,
  startLng: null,
  distanceKm: null,
  roundTrip: null,
  courseType: null,
  lighting: null,
  slope: null,
  facility: null,
  prompt: '',
};

type CourseState = {
  form: CourseForm;
  result: RecommendCourseResponse | null;
  /** step01: 시작 위치 저장 */
  setStart: (p: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }) => void;
  /** step02/03: 선호 조건 일부 갱신 */
  setForm: (partial: Partial<CourseForm>) => void;
  /** 추천 결과 저장 */
  setResult: (result: RecommendCourseResponse | null) => void;
  /** 플로우 초기화 */
  reset: () => void;
};

export const useCourseStore = create<CourseState>((set) => ({
  form: initialForm,
  result: null,
  setStart: (p) =>
    set((s) => ({
      form: {
        ...s.form,
        startName: p.name,
        startAddress: p.address,
        startLat: p.lat,
        startLng: p.lng,
      },
    })),
  setForm: (partial) => set((s) => ({ form: { ...s.form, ...partial } })),
  setResult: (result) => set({ result }),
  reset: () => set({ form: initialForm, result: null }),
}));

/**
 * 현재 form 으로 recommend API 요청 바디를 만든다.
 * 선택하지 않은(=null) 값은 합리적인 기본값으로 채운다.
 */
export function buildRecommendRequest(
  form: CourseForm,
): RecommendCourseRequest {
  return {
    distanceKm: form.distanceKm ?? 3,
    type: toCourseType(form.courseType),
    roundTrip: form.roundTrip ?? true,
    startLat: form.startLat ?? 0,
    startLng: form.startLng ?? 0,
    preferLighting: form.lighting === 'bright',
    preferConvenience: form.facility === 'prefer',
    slopePreference: toSlopePreference(form.slope),
    prompt: form.prompt,
  };
}
