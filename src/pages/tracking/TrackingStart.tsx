import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import { ClockIcon } from '@/components/common/Icon/ClockIcon';
import { textStyles } from '@/styles/tokens';
import { GpsBadge } from './components/GpsBadge';
import { LocationIcon } from '@/components/common/Icon/LocationIcon';
import { reverseGeocode } from '@/apis/kakaoLocal';
import CourseMap, { type LatLng } from '@/components/CourseMap';
import { extractLatLng } from '@/apis/courses';
import { useCourseStore } from '@/stores/courseStore';

/**
 * 러닝 준비 화면.
 * CourseDetail 에서 넘어와 추천 코스를 지도에 보여주고,
 * 사용자가 시작 위치로 이동한 뒤 러닝(/tracking/active)을 시작한다.
 */
export default function TrackingStart() {
  const navigate = useNavigate();
  const result = useCourseStore((s) => s.result);
  const form = useCourseStore((s) => s.form);

  const [myPosition, setMyPosition] = useState<LatLng | null>(null);
  const [myAddress, setMyAddress] = useState<string | null>(null);

  // 결과가 없으면(새로고침 등) 코스 생성 시작 화면으로 보낸다.
  useEffect(() => {
    if (!result) navigate('/course/main', { replace: true });
  }, [result, navigate]);

  // 추천 경로 좌표
  const recommendedPath: LatLng[] = useMemo(
    () =>
      (result?.pathData?.points ?? [])
        .map(extractLatLng)
        .filter((p): p is LatLng => p !== null),
    [result],
  );

  const courseName = `${form.startName || '추천'} 코스`;

  const moveToCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMyPosition({ lat, lng }); // CourseMap 이 마커 표시 + 화면 이동
        const place = await reverseGeocode(lat, lng);
        setMyAddress(place?.address || place?.name || null);
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
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  const startLocationText =
    myAddress ||
    form.startAddress ||
    form.startName ||
    '아직 설정되지 않았어요';

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-surface-white">
      {/* 배경 지도 + 추천 경로 + (이동 시) 현재 위치 마커 */}
      <CourseMap
        recommendedPath={recommendedPath}
        currentPosition={myPosition}
        className="absolute inset-0 z-0"
      />

      {/* 시작 시 씌워지는 그라디언트 오버레이 (상단 정보 가독성) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[220px] bg-gradient-to-b from-black/70 via-black/20 to-transparent" />

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
            {courseName}
          </p>
          <div className="flex items-center gap-1 text-white">
            <span className="block size-[14px]">
              <ClockIcon />
            </span>
            <span className={textStyles['body-medium']}>
              {(result?.totalDistanceKm ?? form.distanceKm ?? 0).toFixed(1)}km
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-white">
            <span className={`text-primary ${textStyles['body-medium-med']}`}>
              시작 위치
            </span>
            <span className={`text-white/70 ${textStyles['body-small']}`}>
              {startLocationText}
            </span>
          </div>
        </div>
        <GpsBadge on={!!myPosition} />
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

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute bottom-[50px] left-1/2 z-20 w-[320px] -translate-x-1/2"
      >
        <Button className="w-full" onClick={() => navigate('/tracking/active')}>
          러닝 시작하기
        </Button>
      </motion.div>
    </div>
  );
}
