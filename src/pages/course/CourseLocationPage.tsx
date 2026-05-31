import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { LocationPinIcon } from '@/components/common/Icon/LocationPinIcon';
import { SearchIcon } from '@/components/common/Icon/SearchIcon';
import {
  useKakaoMaps,
  type KakaoMap,
  type KakaoMarker,
} from '@/hooks/useKakaoMaps';
import { searchKakaoPlaces, type KakaoPlace } from '@/apis/kakaoLocal';
import { useCourseStore } from '@/stores/courseStore';
import { textStyles } from '@/styles/tokens';
import CourseStepBar from './CourseStepBar';

const INITIAL_LOCATION: KakaoPlace = {
  name: '강남역 11번 출구',
  address: '서울 강남구 강남대로 396',
  lat: 37.4979,
  lng: 127.0276,
};

export default function CourseLocationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPlace =
    (location.state as { place?: KakaoPlace } | null)?.place ??
    INITIAL_LOCATION;
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const { ready: mapsReady, error: mapsError } = useKakaoMaps();
  const setStart = useCourseStore((s) => s.setStart);

  const [selected, setSelected] = useState<KakaoPlace>(initialPlace);
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!mapsReady || !mapContainerRef.current || mapRef.current) return;
    const { kakao } = window;
    const center = new kakao.maps.LatLng(selected.lat, selected.lng);
    mapRef.current = new kakao.maps.Map(mapContainerRef.current, {
      center,
      level: 4,
    });
    markerRef.current = new kakao.maps.Marker({
      position: center,
      map: mapRef.current,
    });
  }, [mapsReady, selected.lat, selected.lng]);

  useEffect(() => {
    if (!editing) return;
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      const items = await searchKakaoPlaces(q);
      setResults(items);
      setSearching(false);
    }, 250);
    return () => clearTimeout(t);
  }, [query, editing]);

  const startEdit = () => {
    setEditing(true);
    setQuery('');
    setResults([]);
  };

  const cancelEdit = () => {
    setEditing(false);
    setQuery('');
    setResults([]);
  };

  const pickPlace = (place: KakaoPlace) => {
    setSelected(place);
    setEditing(false);
    setQuery('');
    setResults([]);
    if (!mapRef.current) return;
    const { kakao } = window;
    const latLng = new kakao.maps.LatLng(place.lat, place.lng);
    mapRef.current.setLevel(4);
    mapRef.current.panTo(latLng);
    if (markerRef.current) {
      markerRef.current.setPosition(latLng);
    } else {
      markerRef.current = new kakao.maps.Marker({
        position: latLng,
        map: mapRef.current,
      });
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-surface-white pb-[110px]">
      <div className="px-6 pt-[3px]">
        <CourseStepBar currentStep={0} />
      </div>

      <p
        className={`mt-[26px] text-text-secondary ${textStyles['body-small']}`}
      >
        경로 추천을 받을 위치를 선택해주세요.
      </p>

      <div className="mt-3 flex flex-col gap-3 ">
        <div className="flex h-14 items-center gap-2.5 rounded-[10px] border border-gray-200 bg-surface-white pl-4 pr-3.5">
          <span className="block size-6 shrink-0 text-primary">
            <LocationPinIcon />
          </span>
          <p
            className={`flex-1 truncate text-text-primary ${textStyles['body-medium-bold']}`}
          >
            {selected.name}
          </p>
          <button
            type="button"
            onClick={editing ? cancelEdit : startEdit}
            className={`rounded-full px-3.5 py-1.5 text-primary ${textStyles['body-small-med']}`}
          >
            {editing ? '취소' : '변경'}
          </button>
        </div>

        {editing && (
          <div className="relative">
            <div className="flex h-14 items-center gap-2.5 rounded-[10px] border border-gray-200 bg-surface-white pl-4 pr-3.5">
              <span className="block size-6 shrink-0 text-gray-500">
                <SearchIcon />
              </span>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="위치 검색"
                className={`flex-1 bg-transparent text-text-primary outline-none placeholder:text-gray-500 ${textStyles['body-medium']}`}
              />
            </div>

            {query.trim() && (
              <ul className="absolute inset-x-0 top-[60px] z-10 max-h-[280px] overflow-y-auto rounded-[12px] bg-surface-white shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                {searching ? (
                  <li
                    className={`px-4 py-3 text-gray-500 ${textStyles['body-small']}`}
                  >
                    검색 중...
                  </li>
                ) : results.length === 0 ? (
                  <li
                    className={`px-4 py-3 text-gray-500 ${textStyles['body-small']}`}
                  >
                    검색 결과가 없습니다
                  </li>
                ) : (
                  results.map((p, idx) => (
                    <li key={`${p.name}-${p.address}-${idx}`}>
                      <button
                        type="button"
                        onClick={() => pickPlace(p)}
                        className="flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left hover:bg-gray-100"
                      >
                        <span
                          className={`text-text-primary ${textStyles['body-medium-med']}`}
                        >
                          {p.name}
                        </span>
                        {p.address && p.address !== p.name && (
                          <span
                            className={`text-gray-500 ${textStyles['body-small']}`}
                          >
                            {p.address}
                          </span>
                        )}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        )}

        <div className="relative h-[308px] w-full overflow-hidden rounded-[16px] bg-gray-100">
          <div ref={mapContainerRef} className="absolute inset-0" />
          {mapsError && (
            <div
              className={`absolute inset-0 grid place-items-center px-6 text-center text-gray-500 ${textStyles['body-small']}`}
            >
              지도를 불러올 수 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-9 z-30 mx-auto w-full max-w-[390px] px-5">
        <Button
          className="w-full"
          onClick={() => {
            setStart({
              name: selected.name,
              address: selected.address,
              lat: selected.lat,
              lng: selected.lng,
            });
            navigate('/course/main/step02');
          }}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
