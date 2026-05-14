import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyLocationIcon from '@/assets/icons/Vector.svg?react';
import GroupIcon from '@/assets/icons/Group.svg?react';
import PlusIcon from '@/assets/icons/ei_plus.svg?react';
import MinusIcon from '@/assets/icons/lsicon_minus-outline.svg?react';
import { Button } from '@/components/common/Button';
import { InputBox } from '@/components/common/InputBox';

const RECENT_REGIONS_KEY = 'zeph.recentRegions';
export const FILTER_KEY = 'zeph.filter';
export const USER_LOCATION_KEY = 'zeph.userLocation';

export type Region = { name: string; lat: number; lng: number };

export type FilterValue = {
  region: Region | null;
  radius: number;
  minDistance: number;
  maxDistance: number;
  roundTrip: boolean;
};

const DEFAULT_FILTER: FilterValue = {
  region: null,
  radius: 4,
  minDistance: 0,
  maxDistance: 0,
  roundTrip: false,
};

const MOCK_LOCATION: Region = {
  name: '서울특별시 성북구 정릉제1동',
  lat: 37.6098,
  lng: 127.0084,
};

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY as
  | string
  | undefined;

type KakaoAddressDoc = {
  address_name: string;
  x: string;
  y: string;
};

type KakaoKeywordDoc = {
  place_name: string;
  address_name: string;
  road_address_name?: string;
  x: string;
  y: string;
};

async function searchKakaoRegions(query: string): Promise<Region[]> {
  if (!KAKAO_REST_API_KEY || !query.trim()) return [];
  const headers = { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` };
  const q = encodeURIComponent(query);

  try {
    const [addrRes, kwRes] = await Promise.all([
      fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${q}&size=30`,
        { headers },
      ),
      fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${q}&size=15`,
        { headers },
      ),
    ]);

    const addrData = addrRes.ok
      ? ((await addrRes.json()) as { documents?: KakaoAddressDoc[] })
      : { documents: [] };
    const kwData = kwRes.ok
      ? ((await kwRes.json()) as { documents?: KakaoKeywordDoc[] })
      : { documents: [] };

    const fromAddr: Region[] = (addrData.documents ?? []).map((d) => ({
      name: d.address_name,
      lat: Number(d.y),
      lng: Number(d.x),
    }));

    const fromKw: Region[] = (kwData.documents ?? []).map((d) => ({
      name: d.road_address_name || d.address_name || d.place_name,
      lat: Number(d.y),
      lng: Number(d.x),
    }));

    const seen = new Set<string>();
    const merged: Region[] = [];
    for (const r of [...fromAddr, ...fromKw]) {
      if (
        r.name &&
        !seen.has(r.name) &&
        Number.isFinite(r.lat) &&
        Number.isFinite(r.lng)
      ) {
        seen.add(r.name);
        merged.push(r);
      }
    }
    return merged;
  } catch {
    return [];
  }
}

const PRESET_REGIONS: Region[] = [
  { name: '서울특별시 광진구 광장동', lat: 37.5469, lng: 127.1086 },
  { name: '서울특별시 성동구 성수동', lat: 37.5446, lng: 127.0563 },
  { name: '서울특별시 용산구 이태원동', lat: 37.5345, lng: 126.9947 },
  { name: '서울특별시 종로구 부암동', lat: 37.5921, lng: 126.9633 },
  { name: '서울특별시 강서구 마곡동', lat: 37.5594, lng: 126.8252 },
  { name: '서울특별시 서대문구 신촌동', lat: 37.5556, lng: 126.9377 },
  { name: '서울특별시 마포구 합정동', lat: 37.5495, lng: 126.9134 },
  { name: '서울특별시 동작구 흑석동', lat: 37.5071, lng: 126.9603 },
  { name: '서울특별시 강남구 신사동', lat: 37.521, lng: 127.0214 },
  { name: '서울특별시 송파구 잠실동', lat: 37.5133, lng: 127.1027 },
  { name: '서울특별시 영등포구 여의도동', lat: 37.5235, lng: 126.9277 },
  { name: '서울특별시 중구 명동', lat: 37.5634, lng: 126.9858 },
];

function isRegion(v: unknown): v is Region {
  return (
    !!v &&
    typeof v === 'object' &&
    typeof (v as Region).name === 'string' &&
    typeof (v as Region).lat === 'number' &&
    typeof (v as Region).lng === 'number'
  );
}

function readRecentRegions(): Region[] {
  try {
    const raw = localStorage.getItem(RECENT_REGIONS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(isRegion).slice(0, 5);
  } catch {
    return [];
  }
}

function writeRecentRegions(list: Region[]) {
  localStorage.setItem(RECENT_REGIONS_KEY, JSON.stringify(list.slice(0, 5)));
}

export function readFilter(): FilterValue {
  try {
    const raw = localStorage.getItem(FILTER_KEY);
    if (!raw) return DEFAULT_FILTER;
    const parsed = JSON.parse(raw);
    return {
      region: isRegion(parsed.region) ? parsed.region : null,
      radius: typeof parsed.radius === 'number' ? parsed.radius : 4,
      minDistance:
        typeof parsed.minDistance === 'number' ? parsed.minDistance : 0,
      maxDistance:
        typeof parsed.maxDistance === 'number' ? parsed.maxDistance : 0,
      roundTrip:
        typeof parsed.roundTrip === 'boolean' ? parsed.roundTrip : false,
    };
  } catch {
    return DEFAULT_FILTER;
  }
}

function writeFilter(value: FilterValue) {
  localStorage.setItem(FILTER_KEY, JSON.stringify(value));
}

export function readUserLocation(): { lat: number; lng: number } | null {
  try {
    const raw = localStorage.getItem(USER_LOCATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.lat === 'number' &&
      typeof parsed.lng === 'number'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function writeUserLocation(loc: { lat: number; lng: number }) {
  localStorage.setItem(USER_LOCATION_KEY, JSON.stringify(loc));
}

export default function FilterPage() {
  const navigate = useNavigate();
  const initial = readFilter();
  const [region, setRegion] = useState<Region | null>(initial.region);
  const [radius, setRadius] = useState(initial.radius);
  const [minStr, setMinStr] = useState(
    initial.minDistance ? String(initial.minDistance) : '',
  );
  const [maxStr, setMaxStr] = useState(
    initial.maxDistance ? String(initial.maxDistance) : '',
  );
  const [roundTrip, setRoundTrip] = useState(initial.roundTrip);
  const [recentRegions, setRecentRegions] = useState<Region[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Region[]>([]);
  const [searching, setSearching] = useState(false);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    if (KAKAO_REST_API_KEY) {
      const remote = await searchKakaoRegions(q);
      setSearchResults(remote);
    } else {
      const normalized = q.replace(/\s/g, '');
      setSearchResults(
        PRESET_REGIONS.filter((r) =>
          r.name.replace(/\s/g, '').includes(normalized),
        ),
      );
    }
    setSearching(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => runSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, runSearch]);

  const minDistance = Number(minStr) || 0;
  const maxDistance = Number(maxStr) || 0;

  useEffect(() => {
    setRecentRegions(readRecentRegions());
  }, []);

  useEffect(() => {
    writeFilter({ region, radius, minDistance, maxDistance, roundTrip });
  }, [region, radius, minDistance, maxDistance, roundTrip]);

  const displayedRecent = recentRegions.filter((r) => r.name !== region?.name);

  const swapToSelected = (next: Region) => {
    const prev = region;
    setRegion(next);
    const updated = [
      ...(prev && prev.name !== next.name ? [prev] : []),
      ...recentRegions.filter(
        (r) => r.name !== next.name && r.name !== prev?.name,
      ),
    ].slice(0, 5);
    setRecentRegions(updated);
    writeRecentRegions(updated);
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      swapToSelected(MOCK_LOCATION);
      writeUserLocation({ lat: MOCK_LOCATION.lat, lng: MOCK_LOCATION.lng });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        writeUserLocation(loc);
        swapToSelected({ name: MOCK_LOCATION.name, ...loc });
      },
      () => {
        writeUserLocation({ lat: MOCK_LOCATION.lat, lng: MOCK_LOCATION.lng });
        swapToSelected(MOCK_LOCATION);
      },
    );
  };

  const handleRemoveSelected = () => {
    if (!region) return;
    const updated = [
      region,
      ...recentRegions.filter((r) => r.name !== region.name),
    ].slice(0, 5);
    setRecentRegions(updated);
    writeRecentRegions(updated);
    setRegion(null);
  };

  const radiusPercent = ((radius - 1) / 9) * 100;

  return (
    <div className="flex flex-col gap-[51px] py-[14.5px] pb-12">
      <section className="flex flex-col gap-[17px]">
        <div className="flex flex-col gap-[11px]">
          <h2 className="text-[15px] font-semibold text-text-primary">
            지역 검색
          </h2>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleMyLocation}
              className="flex h-[35px] flex-1 items-center justify-center gap-[5px] rounded-[5px] bg-black text-white"
            >
              <MyLocationIcon className="size-[15px]" />
              <span className="text-[13px] font-semibold">내 위치</span>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="flex h-[35px] flex-1 items-center justify-center gap-[5px] rounded-[5px] bg-black text-white"
            >
              <GroupIcon className="size-[15px]" />
              <span className="text-[13px] font-semibold">지역검색</span>
            </button>
          </div>

          {searchOpen && (
            <div className="flex flex-col gap-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="시/구/동 검색 (예: 성동구)"
                className="h-9 w-full rounded-[5px] border border-gray-400 px-3 text-[13px] text-text-primary outline-none focus:border-primary"
              />
              {searchQuery.trim() && (
                <ul className="flex max-h-[200px] flex-col gap-1 overflow-y-auto rounded-[5px] border border-gray-400 p-2">
                  {searching ? (
                    <li className="px-2 py-1.5 text-[13px] text-gray-500">
                      검색 중...
                    </li>
                  ) : searchResults.length === 0 ? (
                    <li className="px-2 py-1.5 text-[13px] text-gray-500">
                      검색 결과가 없습니다
                    </li>
                  ) : (
                    searchResults.map((r, idx) => (
                      <li key={`${r.name}-${idx}`}>
                        <button
                          type="button"
                          onClick={() => {
                            swapToSelected(r);
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="block w-full rounded px-2 py-1.5 text-left text-[13px] font-medium text-text-primary hover:bg-gray-100"
                        >
                          {r.name}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-[7px]">
        <h2 className="text-[15px] font-semibold text-text-primary">
          선택된 지역
        </h2>
        <p className="text-[11px] font-semibold text-gray-500">
          1개의 지역만 선택 가능합니다
        </p>
        {region ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="선택 해제"
              onClick={handleRemoveSelected}
              className="grid size-5 place-items-center text-gray-500"
            >
              <MinusIcon className="size-4" />
            </button>
            <p className="text-[13px] font-medium text-text-primary">
              {region.name}
            </p>
          </div>
        ) : (
          <p className="text-[13px] text-gray-500">
            지역이 선택되지 않았습니다
          </p>
        )}
        <label className="mt-1 flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={roundTrip}
            onChange={(e) => setRoundTrip(e.target.checked)}
            className="size-[14px] accent-primary"
          />
          <span className="text-[11px] font-medium text-text-secondary">
            왕복 코스만 보기
          </span>
        </label>
      </section>

      <section className="flex flex-col gap-[14px]">
        <h2 className="text-[15px] font-semibold text-text-primary">
          반경 설정 ({radius}km)
        </h2>
        <div className="relative h-[18px]">
          <div className="absolute inset-x-0 top-1/2 h-[5px] -translate-y-1/2 rounded-[10px] bg-gray-400" />
          <div
            className="absolute left-0 top-1/2 h-[5px] -translate-y-1/2 rounded-[10px] bg-primary"
            style={{ width: `${radiusPercent}%` }}
          />
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            aria-label="반경"
            className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-surface-white [&::-webkit-slider-thumb]:size-[18px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-surface-white"
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500">
          <span>1 km</span>
          <span>4 km</span>
          <span>7 km</span>
          <span>10 km</span>
        </div>
      </section>

      <section className="flex flex-col gap-[14px]">
        <h2 className="text-[15px] font-semibold text-text-primary">
          이용한 지역
        </h2>
        <ul className="flex flex-col gap-[14px]">
          {displayedRecent.length === 0 ? (
            <li className="text-[13px] text-gray-500">
              최근 이용한 지역이 없습니다
            </li>
          ) : (
            displayedRecent.map((r) => (
              <li key={r.name} className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={`${r.name} 선택`}
                  onClick={() => swapToSelected(r)}
                  className="grid size-5 place-items-center text-gray-500"
                >
                  <PlusIcon className="size-5" />
                </button>
                <p className="text-[13px] font-medium text-text-primary">
                  {r.name}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="flex flex-col gap-[14px]">
        <h2 className="text-[15px] font-semibold text-text-primary">거리</h2>
        <div className="flex flex-col gap-[14px]">
          <div className="flex flex-col gap-1.5">
            <label className="text-body-medium text-text-primary">최소</label>
            <div className="relative">
              <InputBox
                type="text"
                inputMode="numeric"
                value={minStr}
                onChange={(e) =>
                  setMinStr(e.target.value.replace(/[^0-9]/g, ''))
                }
                placeholder="0"
                className="w-full pr-10"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-body-sm text-text-secondary">
                Km
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-body-medium text-text-primary">최대</label>
            <div className="relative">
              <InputBox
                type="text"
                inputMode="numeric"
                value={maxStr}
                onChange={(e) =>
                  setMaxStr(e.target.value.replace(/[^0-9]/g, ''))
                }
                placeholder="0"
                className="w-full pr-10"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-body-sm text-text-secondary">
                Km
              </span>
            </div>
          </div>
        </div>
      </section>

      <Button onClick={() => navigate(-1)} className="w-full">
        완료
      </Button>
    </div>
  );
}
