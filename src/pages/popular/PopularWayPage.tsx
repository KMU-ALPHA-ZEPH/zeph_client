import { useState } from 'react';
import CourseCard, { type Course } from '@/pages/popular/CourseCard';
import PopularWayHeader, {
  type PopularWayTab,
} from '@/pages/popular/PopularWayHeader';

const sampleCourses: Course[] = [
  {
    rank: 1,
    city: '서울시',
    district: '광진구 광장동',
    distance: 8,
    description: '벚꽃 길 특화 산책 코스~!',
    imageUrl: 'https://placehold.co/347x140',
  },
  {
    rank: 2,
    city: '서울시',
    district: '성동구 성수동',
    distance: 5,
    description: '한강뷰 러닝 코스',
    imageUrl: 'https://placehold.co/347x140/cccccc/333333',
  },
  {
    rank: 3,
    city: '서울시',
    district: '용산구 이태원동',
    distance: 12,
    description: '도심 야경 산책',
  },
];

export default function PopularWayPage() {
  const [activeTab, setActiveTab] = useState<PopularWayTab>('walk');

  return (
    <>
      <PopularWayHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        count={2440}
        onSearchClick={() => {}}
        onFilterClick={() => {}}
        onSortClick={() => {}}
      />

      <ul className="mt-4 flex flex-col gap-3 pb-6">
        {sampleCourses.map((course) => (
          <li key={course.rank}>
            <CourseCard course={course} />
          </li>
        ))}
      </ul>
    </>
  );
}
