import type { AuthResponse } from '@/apis/auth';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export type StoredUser = {
  name: string;
  email: string;
  profile_image_url?: string;
  kakaoid?: number;
};

export function isAuthed(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
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

export function saveAuth(auth: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, auth.token);
  const user: StoredUser = {
    name: auth.name,
    email: auth.email,
    profile_image_url: auth.profile_image_url,
    kakaoid: auth.kakaoid,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
