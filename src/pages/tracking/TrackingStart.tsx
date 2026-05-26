import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import { ClockIcon } from '@/components/common/Icon/ClockIcon';
import { textStyles } from '@/styles/tokens';
import { GpsBadge } from './components/GpsBadge';
import { LocationIcon } from '@/components/common/Icon/LocationIcon';
import { reverseGeocode, type KakaoPlace } from '@/apis/kakaoLocal';
import type { KakaoMap, KakaoMarker } from '@/hooks/useKakaoMaps';

export default function TrackingStart() {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);

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
      {/* 배경 이미지 영역 (추후 코스/지도 이미지로 교체) */}
      <div className="absolute inset-0 z-0 bg-gray-400" />

      {/* 시작 시 씌워지는 그라디언트 오버레이 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/20 via-35% to-transparent"
      />

      {/* 뒤로가기 */}
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => navigate(-1)}
        className="absolute left-3 top-4 z-30 grid size-7 place-items-center text-white"
      >
        <BackIcon />
      </button>

      {/* 코스 정보 + GPS 뱃지 */}
      <div className="absolute left-[42px] top-[61px] z-20 flex items-start gap-6">
        <div className="w-[203px]">
          <p className={`text-white ${textStyles['heading-h2']}`}>
            뚝섬 한강 공원 코스
          </p>
          <div className="flex items-center gap-1 text-white">
            <span className="block size-[14px]">
              <ClockIcon />
            </span>
            <span className={textStyles['body-medium']}>3.25 - 21:05 pm</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-white">
            <span className={`text-primary ${textStyles['body-medium-med']}`}>
              시작 위치
            </span>
            <span className={`text-white/70 ${textStyles['body-small']}`}>
              {selectedPlace?.address ||
                selectedPlace?.name ||
                '아직 설정되지 않았어요'}
            </span>
          </div>
        </div>
        <GpsBadge on />
      </div>

      <button
        type="button"
        aria-label="현재 위치로 이동"
        onClick={moveToCurrentLocation}
        className="absolute bottom-[112px] right-[35px] z-20 grid size-14 place-items-center rounded-full bg-surface-white text-black shadow-[2px_6px_6px_rgba(0,0,0,0.25)] transition-transform active:scale-95"
      >
        <span className="block size-7">
          <LocationIcon />
        </span>
      </button>

      <Button
        className="absolute bottom-[50px] left-1/2 z-20 w-[320px] -translate-x-1/2"
        inactive={!selectedPlace}
        onClick={() =>
          selectedPlace &&
          navigate('/course/main/step01', { state: { place: selectedPlace } })
        }
      >
        시작 위치로 이동해주세요 :)
      </Button>
    </div>
  );
}
