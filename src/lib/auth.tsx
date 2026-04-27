const AUTH_KEY = 'auth_token';

export function isAuthed(): boolean {
  return !!localStorage.getItem(AUTH_KEY);
}

export function loginMock(): Promise<void> {
  return new Promise((resolve) => {
    localStorage.setItem(AUTH_KEY, 'dummy-token');
    resolve();
  });
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}
