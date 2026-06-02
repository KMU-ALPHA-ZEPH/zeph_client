import api from '@/lib/axios';

export type GroupResponse = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  courseCount: number;
  createdAt: string;
};

export type AddGroupRequest = {
  name: string;
  description?: string;
};

export type UpdateGroupRequest = {
  name?: string;
  description?: string;
  image?: File | null;
};

export async function getGroups(): Promise<GroupResponse[]> {
  const { data } = await api.get<GroupResponse[]>('/v0/groups');
  return data;
}

export async function addGroup(body: AddGroupRequest): Promise<GroupResponse> {
  const { data } = await api.post<GroupResponse>('/v0/groups', body);
  return data;
}

export async function updateGroup(
  groupId: number,
  body: UpdateGroupRequest,
): Promise<void> {
  const formData = new FormData();
  if (body.name !== undefined) formData.append('name', body.name);
  if (body.description !== undefined)
    formData.append('description', body.description);
  if (body.image) formData.append('image', body.image);
  await api.patch(`/v0/groups/${groupId}`, formData);
}
