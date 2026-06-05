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

export type CreateScrapResponse = {
  scrapId?: number;
  id?: number;
  courseId?: number;
};

export async function createScrap(
  body: CreateScrapRequest,
): Promise<CreateScrapResponse> {
  const { data } = await api.post<CreateScrapResponse>('/v0/scraps', body);
  return data;
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

export async function getScraps(
  params: { keyword?: string } = {},
): Promise<ScrapPreviewResponse[]> {
  const { data } = await api.get<ScrapPreviewResponse[]>('/v0/scraps', {
    params,
  });
  return data;
}

export async function unsetScrapGroup(scrapId: number): Promise<void> {
  await api.patch(`/v0/scraps/${scrapId}`, { groupId: null });
}

export async function deleteScrap(scrapId: number): Promise<void> {
  await api.delete(`/v0/scraps/${scrapId}`);
}
