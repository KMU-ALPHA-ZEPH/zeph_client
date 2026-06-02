import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import HeartIcon from '@/assets/icons/mynaui_heart-solid.svg?react';
import TabBarLayout from '@/components/layout/TabBarLayout';
import ScrapCourseThumb from '@/pages/scrap/ScrapCourseThumb';
import { unlikeCourse } from '@/apis/likes';
import {
  getCourseDetail,
  getCourses,
  type CourseListItem,
} from '@/apis/courses';
import { useCourseStore } from '@/stores/courseStore';

const TYPE_TO_FORM: Record<string, 'workout' | 'walk' | 'safety' | null> = {
  walk: 'walk',
  safety: 'safety',
  exercise: 'workout',
  workout: 'workout',
};

export default function LikedCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);

  const setResult = useCourseStore((s) => s.setResult);
  const setForm = useCourseStore((s) => s.setForm);
  const resetCourse = useCourseStore((s) => s.reset);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getCourses({ liked: true })
      .then((data) => setCourses(data))
      .catch((e) => {
        console.error('[LikedCoursesPage] getCourses(liked) failed:', e);
        setError('좋아요한 코스를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUnlike = async (course: CourseListItem) => {
    const prev = courses;
    setCourses((cur) => cur.filter((c) => c.id !== course.id));
    try {
      await unlikeCourse(course.id);
    } catch (e) {
      console.error('[LikedCoursesPage] unlikeCourse failed:', e);
      alert('좋아요 해제에 실패했습니다.');
      setCourses(prev);
    }
  };

  const handleOpenCourse = async (course: CourseListItem) => {
    if (navigating) return;
    setNavigating(true);
    try {
      const detail = await getCourseDetail(course.id);
      resetCourse();
      setForm({
        startName: course.name,
        startAddress: course.region ?? '',
        startLat: detail.startLat,
        startLng: detail.startLng,
        distanceKm: detail.distanceKm,
        courseType: TYPE_TO_FORM[detail.type] ?? null,
      });
      setResult({
        totalDistanceKm: detail.distanceKm,
        type: detail.type,
        startLat: detail.startLat,
        startLng: detail.startLng,
        pathData: detail.pathData,
      });
      navigate('/course/detail', {
        state: {
          courseId: course.id,
          initialName: course.name,
          initialDescription: course.description,
        },
      });
    } catch {
      alert('코스 정보를 불러오지 못했습니다.');
    } finally {
      setNavigating(false);
    }
  };

  return (
    <div className="flex flex-col px-5">
      <header className="sticky top-0 z-10 -mx-5 flex h-[calc(60px+env(safe-area-inset-top))] items-center bg-surface-white px-3 pt-[env(safe-area-inset-top)]">
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={() => navigate(-1)}
          className="flex size-7 items-center justify-center text-black"
        >
          <BackIcon className="size-6" />
        </button>
      </header>

      <section className="flex gap-[14px]">
        <div className="grid size-[120px] flex-shrink-0 place-items-center overflow-hidden rounded-[10px] bg-gray-300">
          <HeartIcon className="size-[60px] text-[#FF5C5C]" />
        </div>
        <div className="flex h-[120px] w-[216px] flex-shrink-0 flex-col justify-center">
          <h1 className="truncate text-h2 font-semibold text-text-primary">
            좋아요 표시한 코스
          </h1>
          <p className="line-clamp-2 text-body-md text-text-secondary">
            좋아요를 남긴 코스는
            <br />
            인기 코스 집계에 활용돼요.
          </p>
        </div>
      </section>

      <p className="mt-5 text-body-sm text-text-primary">
        총 {courses.length}개의 코스
      </p>

      <div className="mt-2 h-px bg-gray-400" />

      {loading ? (
        <p className="mt-10 self-center text-body-sm text-gray-500">
          불러오는 중...
        </p>
      ) : error ? (
        <p className="mt-10 self-center text-body-sm text-status-error">
          {error}
        </p>
      ) : courses.length === 0 ? (
        <p className="mt-10 self-center text-body-sm text-gray-500">
          아직 좋아요 표시한 코스가 없습니다
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-x-[13px] gap-y-1 pb-[110px] pt-4">
          {courses.map((c) => (
            <li key={c.id}>
              <ScrapCourseThumb
                data={{
                  id: String(c.id),
                  name: c.name,
                  description: c.description,
                  region: c.region,
                  isBookmarked: true,
                }}
                iconType="heart"
                onClick={() => handleOpenCourse(c)}
                onBookmarkToggle={() => handleUnlike(c)}
              />
            </li>
          ))}
        </ul>
      )}

      <TabBarLayout activeTab="scrap" />
    </div>
  );
}
