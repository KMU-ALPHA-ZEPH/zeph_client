import { useEffect, useState } from 'react';

export type KakaoLatLng = {
  getLat(): number;
  getLng(): number;
};

export type KakaoLatLngBounds = {
  extend(latLng: KakaoLatLng): void;
};

export type KakaoMap = {
  panTo(latLng: KakaoLatLng): void;
  setCenter(latLng: KakaoLatLng): void;
  setLevel(level: number): void;
  setBounds(bounds: KakaoLatLngBounds): void;
};

export type KakaoMarker = {
  setPosition(latLng: KakaoLatLng): void;
  setMap(map: KakaoMap | null): void;
};

export type KakaoPolyline = {
  setPath(path: KakaoLatLng[]): void;
  setMap(map: KakaoMap | null): void;
};

type KakaoMaps = {
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number },
  ) => KakaoMap;
  Marker: new (options: {
    position: KakaoLatLng;
    map?: KakaoMap;
  }) => KakaoMarker;
  Polyline: new (options: {
    path: KakaoLatLng[];
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: string;
    map?: KakaoMap;
  }) => KakaoPolyline;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  LatLngBounds: new () => KakaoLatLngBounds;
  load(cb: () => void): void;
};

declare global {
  interface Window {
    kakao: { maps: KakaoMaps };
  }
}

const SCRIPT_ID = 'kakao-maps-sdk';
let loadPromise: Promise<void> | null = null;

function loadKakaoMaps(appKey: string): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('window is not available'));
      return;
    }
    if (window.kakao?.maps) {
      resolve();
      return;
    }

    const existing = document.getElementById(
      SCRIPT_ID,
    ) as HTMLScriptElement | null;
    const onReady = () => window.kakao.maps.load(() => resolve());

    if (existing) {
      existing.addEventListener('load', onReady, { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('Kakao Maps SDK failed to load')),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.onload = onReady;
    script.onerror = () => reject(new Error('Kakao Maps SDK failed to load'));
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function useKakaoMaps() {
  const appKey = import.meta.env.VITE_KAKAO_JS_APP_KEY as string | undefined;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!appKey) {
      setError(new Error('VITE_KAKAO_JS_APP_KEY is not set'));
      return;
    }
    let cancelled = false;
    loadKakaoMaps(appKey)
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e);
      });
    return () => {
      cancelled = true;
    };
  }, [appKey]);

  return { ready, error };
}
