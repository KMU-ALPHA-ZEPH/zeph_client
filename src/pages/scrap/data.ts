import type { ScrapCourseItem } from '@/pages/scrap/ScrapCourseThumb';

export type ScrapCategory = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  iconType?: 'heart';
  courses: ScrapCourseItem[];
};

const makeCourses = (
  prefix: string,
  names: string[],
  region: string,
): ScrapCourseItem[] =>
  names.map((name, i) => ({
    id: `${prefix}-${i}`,
    name,
    date: '2025.06.31',
    region,
    isBookmarked: true,
  }));

export const SCRAP_CATEGORIES: ScrapCategory[] = [
  {
    id: 'liked',
    title: '좋아요 표시한 코스',
    iconType: 'heart',
    courses: makeCourses(
      'liked',
      [
        '뚝섬 한강 공원',
        '서울숲 둘레길',
        '남산 둘레길',
        '올림픽공원',
        '청계천 산책',
        '여의도 한강공원',
      ],
      '서울시\n광진구 광장동',
    ),
  },
  {
    id: 'walk-1',
    title: '산책',
    description: '완만한 경사도, 공원 위주',
    courses: makeCourses(
      'walk-1',
      [
        '뚝섬 한강 공원',
        '서울숲 둘레길',
        '석촌호수 산책',
        '응봉산 둘레',
        '낙산공원 산책',
      ],
      '서울시\n광진구 광장동',
    ),
  },
  {
    id: 'workout-1',
    title: '운동',
    description: '가파른 경사도, 러닝시간 1시간 +',
    courses: makeCourses(
      'workout-1',
      [
        '남산 둘레길',
        '올림픽공원 인터벌',
        '북악스카이웨이',
        '응봉산 한바퀴',
        '북한산 둘레길',
      ],
      '서울시\n중구 회현동',
    ),
  },
  {
    id: 'safety-1',
    title: '안전',
    description: '완만한 경사도, 공원 위주',
    courses: makeCourses(
      'safety-1',
      [
        '신촌 안심 코스',
        '합정 안심 코스',
        '여의도 공원 야간',
        '한강대교 야간 코스',
        '명동 도심 산책',
      ],
      '서울시\n서대문구 신촌동',
    ),
  },
  {
    id: 'walk-2',
    title: '산책',
    description: '완만한 경사도, 공원 위주',
    courses: makeCourses(
      'walk-2',
      ['낙산공원', '서대문 안산자락길', '월드컵공원', '서울숲', '청계천'],
      '서울시\n종로구 이화동',
    ),
  },
  {
    id: 'walk-3',
    title: '산책',
    description: '완만한 경사도, 공원 위주',
    courses: makeCourses(
      'walk-3',
      [
        '북서울꿈의숲',
        '경춘선숲길',
        '동부간선도로 자전거길',
        '하늘공원',
        '망원한강공원',
      ],
      '서울시\n강북구 번동',
    ),
  },
  {
    id: 'workout-2',
    title: '운동',
    description: '가파른 경사도, 러닝시간 1시간 +',
    courses: makeCourses(
      'workout-2',
      [
        '인왕산 등반',
        '북한산 둘레',
        '청계산 정상',
        '관악산 등산',
        '도봉산 등반',
      ],
      '서울시\n종로구 부암동',
    ),
  },
  {
    id: 'workout-3',
    title: '운동',
    description: '가파른 경사도, 러닝시간 1시간 +',
    courses: makeCourses(
      'workout-3',
      [
        '잠실 종합운동장',
        '석촌호수 인터벌',
        '한강 잠수교',
        '뚝섬 인터벌',
        '서울숲 인터벌',
      ],
      '서울시\n송파구 잠실동',
    ),
  },
];

export function getCategory(id: string): ScrapCategory | undefined {
  return SCRAP_CATEGORIES.find((c) => c.id === id);
}
