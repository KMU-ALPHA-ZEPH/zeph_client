import api from '@/lib/axios';

/**
 * 좋아요 전용 카드(하트)와 동일 이름의 일반 그룹이 백엔드에 남아있을 경우
 * 스크랩 목록/저장 모달에서 노출하지 않도록 필터링할 때 사용한다.
 */
export const LIKED_GROUP_NAME = '좋아요 표시한 코스';

export async function likeCourse(courseId: number): Promise<void> {
  await api.post(`/v0/courses/${courseId}/likes`);
}

export async function unlikeCourse(courseId: number): Promise<void> {
  await api.delete(`/v0/courses/${courseId}/likes`);
}
