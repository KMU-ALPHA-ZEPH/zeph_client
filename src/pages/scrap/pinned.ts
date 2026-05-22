const KEY = 'zeph:pinned-scraps';

export function readPinned(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isPinned(id: string): boolean {
  return readPinned().includes(id);
}

export function togglePinned(id: string): boolean {
  const pinned = readPinned();
  const idx = pinned.indexOf(id);
  if (idx >= 0) pinned.splice(idx, 1);
  else pinned.push(id);
  localStorage.setItem(KEY, JSON.stringify(pinned));
  return idx < 0;
}
