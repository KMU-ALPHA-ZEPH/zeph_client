import { logoutApi, type AuthResponse } from '@/apis/auth';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export type StoredUser = {
  id?: number;
  name: string;
  email: string;
  profile_image_url?: string;
  kakaoid?: number;
};

function decodeJwtUserId(token: string): number | undefined {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const sub = Number(payload.sub);
    return Number.isFinite(sub) ? sub : undefined;
  } catch {
    return undefined;
  }
}

export function isAuthed(): boolean {
  return !!localStorage.getItem(USER_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function saveUser(user: StoredUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveAuth(auth: AuthResponse): void {
  if (auth.token) {
    localStorage.setItem(TOKEN_KEY, auth.token);
  }
  saveUser({
    id: auth.token ? decodeJwtUserId(auth.token) : undefined,
    name: auth.name,
    email: auth.email,
    profile_image_url: auth.profile_image_url,
    kakaoid: auth.kakaoid,
  });
}

export async function logout(): Promise<void> {
  try {
    await logoutApi();
  } catch {
    // 서버 쿠키 정리 실패해도 로컬 정보는 정리
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
