const KEY = 'zeph:pinned-groups';

export function readPinned(): number[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((v): v is number => typeof v === 'number');
  } catch {
    return [];
  }
}

export function isPinned(groupId: number): boolean {
  return readPinned().includes(groupId);
}

/** 토글하고 변경 후 핀 여부를 반환 */
export function togglePinned(groupId: number): boolean {
  const list = readPinned();
  const idx = list.indexOf(groupId);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(groupId);
  }
  localStorage.setItem(KEY, JSON.stringify(list));
  return idx < 0;
}
