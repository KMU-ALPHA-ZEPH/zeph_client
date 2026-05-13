import { useState } from 'react';
import CourseCard, { type Course } from '@/components/CourseCard';
import PopularWayHeader, {
  type PopularWayTab,
} from '@/components/PopularWayHeader';

const sampleCourses: Course[] = [
  {
    rank: 1,
    city: '서울시',
    district: '광진구 광장동',
    distance: 8,
    description: '벚꽃 길 특화 산책 경로~!',
    imageUrl: 'https://placehold.co/347x140',
    isBookmarked: false,
  },
  {
    rank: 2,
    city: '서울시',
    district: '성동구 성수동',
    distance: 5,
    description: '한강뷰 러닝 코스',
    imageUrl: 'https://placehold.co/347x140/cccccc/333333',
    isBookmarked: true,
  },
  {
    rank: 3,
    city: '서울시',
    district: '용산구 이태원동',
    distance: 12,
    description: '도심 야경 산책',
    isBookmarked: false,
  },
];

export default function PopularWayPage() {
  const [activeTab, setActiveTab] = useState<PopularWayTab>('walk');
  const [courses, setCourses] = useState(sampleCourses);

  const toggleBookmark = (rank: number) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.rank === rank ? { ...c, isBookmarked: !c.isBookmarked } : c,
      ),
    );
  };

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
        {courses.map((course) => (
          <li key={course.rank}>
            <CourseCard
              course={course}
              onBookmarkToggle={() => toggleBookmark(course.rank)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
