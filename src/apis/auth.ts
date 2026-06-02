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

/** 비밀번호 재설정 메일 발송 요청 */
export async function requestPasswordReset(email: string): Promise<void> {
  await api.post('/users/password-reset/request', { email });
}

/** 메일로 받은 토큰 + 새 비밀번호로 비밀번호 재설정 */
export async function confirmPasswordReset(
  token: string,
  newPassword: string,
): Promise<void> {
  await api.post('/users/password-reset/confirm', { token, newPassword });
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

/** 인증(쿠키/JWT)으로 식별되는 현재 로그인 사용자 프로필 조회 */
export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/users/me');
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
