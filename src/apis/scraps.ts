import api from '@/lib/axios';
import type { PathData } from '@/apis/courses';

export type CreateCourseRequest = {
  name: string;
  description?: string;
  type: string;
  distanceKm: number;
  pathData: PathData;
  roundTrip: boolean;
  preferLighting: boolean;
  preferConvenience: boolean;
  slopePreference: string;
};

export type CreateScrapRequest = {
  groupId: number;
  courseId?: number;
  courseData?: CreateCourseRequest;
};

export async function createScrap(body: CreateScrapRequest): Promise<void> {
  await api.post('/v0/scraps', body);
}

export type ScrapPreviewResponse = {
  scrapId: number;
  courseId: number;
  type: string;
  name: string;
  description?: string;
  distanceKm: number;
  region: string;
  groupId: number;
  groupName: string;
  savedAt: string;
  coursePath?: { lat: number; lng: number }[];
};

export async function getScrapsByGroup(
  groupId: number,
): Promise<ScrapPreviewResponse[]> {
  const { data } = await api.get<ScrapPreviewResponse[]>(
    `/v0/scraps/${groupId}`,
  );
  return data;
}

/** 스크랩의 groupId 를 null 로 바꿔서 그룹에서 제거한다 (스크랩 자체는 유지) */
export async function unsetScrapGroup(scrapId: number): Promise<void> {
  await api.patch(`/v0/scraps/${scrapId}`, { groupId: null });
}

/** 스크랩 자체를 삭제한다. */
export async function deleteScrap(scrapId: number): Promise<void> {
  await api.delete(`/v0/scraps/${scrapId}`);
}
