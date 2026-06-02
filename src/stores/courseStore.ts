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
  /**
   * 현재 디테일 페이지/트래킹 세션에서 다루고 있는 코스의 식별자.
   * - null: 아직 백엔드에 저장되지 않은 추천 결과
   * - 양수: 백엔드에 저장된 코스의 id
   */
  currentCourseId: number | null;
  /**
   * 현재 코스가 속한 스크랩의 식별자.
   * - null: 스크랩되지 않음
   * - 양수: 백엔드 scrapId
   * - -1: 방금 생성해서 아직 백엔드 id 를 모르는 임시 활성 상태
   */
  currentScrapId: number | null;
  /**
   * 사용자가 디테일/편집 모달에서 수정한 코스 이름. 아직 저장되지 않은
   * 추천 코스는 백엔드 PATCH 가 불가하므로 store 에 보관했다가 스크랩 저장 시 함께 보낸다.
   */
  currentCourseName: string | null;
  /** 사용자가 입력/수정한 코스 설명. 동일하게 스크랩 저장 시점에 함께 보낸다. */
  currentCourseDescription: string | null;
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
  /** 현재 코스/스크랩 식별자 + 이름/설명 부분 갱신 */
  setCurrent: (p: {
    courseId?: number | null;
    scrapId?: number | null;
    courseName?: string | null;
    courseDescription?: string | null;
  }) => void;
  /** 플로우 초기화 */
  reset: () => void;
};

export const useCourseStore = create<CourseState>((set) => ({
  form: initialForm,
  result: null,
  currentCourseId: null,
  currentScrapId: null,
  currentCourseName: null,
  currentCourseDescription: null,
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
  setCurrent: (p) =>
    set((s) => ({
      currentCourseId:
        p.courseId === undefined ? s.currentCourseId : p.courseId,
      currentScrapId: p.scrapId === undefined ? s.currentScrapId : p.scrapId,
      currentCourseName:
        p.courseName === undefined ? s.currentCourseName : p.courseName,
      currentCourseDescription:
        p.courseDescription === undefined
          ? s.currentCourseDescription
          : p.courseDescription,
    })),
  reset: () =>
    set({
      form: initialForm,
      result: null,
      currentCourseId: null,
      currentScrapId: null,
      currentCourseName: null,
      currentCourseDescription: null,
    }),
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
