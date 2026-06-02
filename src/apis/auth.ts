import api from '@/lib/axios';

export type AuthResponse = {
  kakaoid?: number;
  name: string;
  email: string;
  profile_image_url?: string;
  token: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  name: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export async function signup(body: SignupRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/users/signup', body);
  return data;
}

export async function login(body: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/users/login', body);
  return data;
}

export async function loginWithKakaoCode(code: string): Promise<AuthResponse> {
  const { data } = await api.get<AuthResponse>('/login/oauth2/code/kakao', {
    params: { code },
  });
  return data;
}

export async function logoutApi(): Promise<void> {
  await api.post('/users/logout');
}

export type UserProfile = {
  id: number;
  kakaoId?: number;
  email: string;
  name: string;
  profile_image_url?: string;
  created_at?: string;
  updated_at?: string;
};

export async function getProfile(id: number): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>(`/users/${id}`);
  return data;
}

export async function updateProfile(
  id: number,
  body: { name?: string; image?: File | null },
): Promise<void> {
  const formData = new FormData();
  if (body.name !== undefined) formData.append('name', body.name);
  if (body.image) formData.append('image', body.image);
  await api.put(`/users/${id}`, formData);
}

export async function deleteAccount(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
