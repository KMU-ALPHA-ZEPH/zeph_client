const KEY = 'zeph:scrap-overrides';

export type ScrapOverride = {
  title?: string;
  description?: string;
  imageUrl?: string;
};

export function readOverrides(): Record<string, ScrapOverride> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, ScrapOverride>) : {};
  } catch {
    return {};
  }
}

export function setOverride(id: string, patch: ScrapOverride): void {
  const all = readOverrides();
  all[id] = { ...(all[id] ?? {}), ...patch };
  localStorage.setItem(KEY, JSON.stringify(all));
}
