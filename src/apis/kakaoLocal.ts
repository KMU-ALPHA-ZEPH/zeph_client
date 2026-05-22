export type KakaoPlace = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

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

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY as
  | string
  | undefined;

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<KakaoPlace | null> {
  if (!KAKAO_REST_API_KEY) return null;
  const headers = { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` };
  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
      { headers },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      documents?: {
        address?: { address_name: string };
        road_address?: { address_name: string; building_name?: string };
      }[];
    };
    const doc = data.documents?.[0];
    const roadName = doc?.road_address?.building_name
      ? `${doc.road_address.address_name} (${doc.road_address.building_name})`
      : doc?.road_address?.address_name;
    const name = roadName || doc?.address?.address_name;
    if (!name) return null;
    return {
      name,
      address: doc?.address?.address_name || '',
      lat,
      lng,
    };
  } catch {
    return null;
  }
}

export async function searchKakaoPlaces(query: string): Promise<KakaoPlace[]> {
  if (!KAKAO_REST_API_KEY || !query.trim()) return [];
  const headers = { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` };
  const q = encodeURIComponent(query);

  try {
    const [addrRes, kwRes] = await Promise.all([
      fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${q}&size=10`,
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

    const fromKw: KakaoPlace[] = (kwData.documents ?? []).map((d) => ({
      name: d.place_name,
      address: d.road_address_name || d.address_name,
      lat: Number(d.y),
      lng: Number(d.x),
    }));

    const fromAddr: KakaoPlace[] = (addrData.documents ?? []).map((d) => ({
      name: d.address_name,
      address: d.address_name,
      lat: Number(d.y),
      lng: Number(d.x),
    }));

    const seen = new Set<string>();
    const merged: KakaoPlace[] = [];
    for (const p of [...fromKw, ...fromAddr]) {
      const key = `${p.name}|${p.address}`;
      if (
        p.name &&
        !seen.has(key) &&
        Number.isFinite(p.lat) &&
        Number.isFinite(p.lng)
      ) {
        seen.add(key);
        merged.push(p);
      }
    }
    return merged;
  } catch {
    return [];
  }
}
