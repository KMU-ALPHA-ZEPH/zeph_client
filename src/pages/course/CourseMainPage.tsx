import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBarLayout from '@/components/layout/TabBarLayout';
import {
  useKakaoMaps,
  type KakaoMap,
  type KakaoMarker,
} from '@/hooks/useKakaoMaps';
import { Button } from '@/components/common/Button';
import { LocationIcon } from '@/components/common/Icon/LocationIcon';
import { textStyles } from '@/styles/tokens';
import CourseSearchBar from './CourseSearchBar';
import { reverseGeocode, type KakaoPlace } from '@/apis/kakaoLocal';

const DEFAULT_CENTER = { lat: 37.6098, lng: 127.0084 };
const DEFAULT_LEVEL = 4;

export default function CourseMainPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const { ready: mapsReady, error: mapsError } = useKakaoMaps();

  useEffect(() => {
    if (!mapsReady || !mapContainerRef.current || mapRef.current) return;
    const { kakao } = window;
    mapRef.current = new kakao.maps.Map(mapContainerRef.current, {
      center: new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
      level: DEFAULT_LEVEL,
    });
  }, [mapsReady]);

  const moveToPlace = (place: KakaoPlace) => {
    setSelectedPlace(place);
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

  const moveToCurrentLocation = () => {
    const map = mapRef.current;
    if (!map) {
      console.warn('map not ready');
      return;
    }
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { kakao } = window;
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const latLng = new kakao.maps.LatLng(lat, lng);
        map.setLevel(4);
        map.panTo(latLng);
        if (markerRef.current) {
          markerRef.current.setPosition(latLng);
        } else {
          markerRef.current = new kakao.maps.Marker({
            position: latLng,
            map,
          });
        }
        const place = await reverseGeocode(lat, lng);
        setSelectedPlace(place ?? { name: '내 위치', address: '', lat, lng });
      },
      (err) => {
        console.warn('geolocation failed', err);
        const msg =
          err.code === 1
            ? '위치 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.'
            : err.code === 3
              ? '위치 정보를 가져오는 데 시간이 너무 오래 걸립니다.'
              : '현재 위치를 가져올 수 없습니다.';
        alert(msg);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    );
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-surface-white">
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {mapsError && (
        <div
          className={`absolute inset-0 grid place-items-center bg-gray-100 px-6 text-center text-gray-500 ${textStyles['body-small']}`}
        >
          지도를 불러올 수 없습니다. .env에 VITE_KAKAO_JS_APP_KEY를 설정해
          주세요.
        </div>
      )}

      <div className="absolute inset-x-0 top-[53px] z-20 flex justify-center px-5">
        <CourseSearchBar
          value={searchValue}
          onChange={setSearchValue}
          onSelect={moveToPlace}
        />
      </div>

      <button
        type="button"
        aria-label="현재 위치로 이동"
        onClick={moveToCurrentLocation}
        className="absolute bottom-[185px] right-[35px] z-20 grid size-14 place-items-center rounded-full bg-surface-white text-black shadow-[2px_6px_6px_rgba(0,0,0,0.25)] transition-transform active:scale-95"
      >
        <span className="block size-7">
          <LocationIcon />
        </span>
      </button>

      <Button
        className="absolute bottom-[124px] left-1/2 z-20 w-[320px] -translate-x-1/2"
        inactive={!selectedPlace}
        onClick={() =>
          selectedPlace &&
          navigate('/course/main/step01', { state: { place: selectedPlace } })
        }
      >
        {selectedPlace ? '나만의 코스 생성하기' : '시작 위치를 설정해주세요'}
      </Button>

      <TabBarLayout activeTab="course" showGradient={false} />
    </div>
  );
}
