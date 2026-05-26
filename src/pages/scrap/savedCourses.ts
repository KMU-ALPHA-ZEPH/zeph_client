import type { ScrapCourseItem } from '@/pages/scrap/ScrapCourseThumb';

const KEY = 'zeph:saved-courses';

export function readSavedCourses(): Record<string, ScrapCourseItem[]> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, ScrapCourseItem[]>) : {};
  } catch {
    return {};
  }
}

export function getSavedCourses(categoryId: string): ScrapCourseItem[] {
  return readSavedCourses()[categoryId] ?? [];
}

export function addSavedCourse(
  categoryId: string,
  course: ScrapCourseItem,
): void {
  const all = readSavedCourses();
  const list = all[categoryId] ?? [];
  if (list.some((c) => c.id === course.id)) return;
  all[categoryId] = [course, ...list];
  localStorage.setItem(KEY, JSON.stringify(all));
}
