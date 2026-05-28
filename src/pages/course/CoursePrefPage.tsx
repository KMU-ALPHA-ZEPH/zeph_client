import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { textStyles } from '@/styles/tokens';
import CourseStepBar from './CourseStepBar';
import PrefOptionCard from './PrefOptionCard';
import {
  ArrowBothIcon,
  InfinityIcon,
  CategoryIcon,
  BulbIcon,
  SlopeIcon,
  ShieldIcon,
  StoreIcon,
} from './icons';
import DistanceModal, { type DistanceValue } from './OptionModal/DistanceModal';
import RouteTypeModal, {
  type RouteTypeValue,
} from './OptionModal/RouteTypeModal';
import CourseTypeModal, {
  type CourseTypeValue,
} from './OptionModal/CourseTypeModal';
import LightingModal, { type LightingValue } from './OptionModal/LightingModal';
import SlopeModal, { type SlopeValue } from './OptionModal/SlopeModal';
import SafetyModal, { type SafetyValue } from './OptionModal/SafetyModal';
import FacilityModal, { type FacilityValue } from './OptionModal/FacilityModal';
import { useNavigate } from 'react-router-dom';

const formatDistance = (km: DistanceValue): string => {
  const n = Number(km);
  return Number.isFinite(n) ? `${n.toFixed(1)}km` : '';
};

const ROUTE_TYPE_LABEL: Record<RouteTypeValue, string> = {
  round: '왕복',
  oneway: '편도',
};

const COURSE_TYPE_LABEL: Record<CourseTypeValue, string> = {
  workout: '운동',
  walk: '산책',
  safety: '안전',
};

const LIGHTING_LABEL: Record<LightingValue, string> = {
  bright: '밝은 길',
  any: '상관없음',
};

const SLOPE_LABEL: Record<SlopeValue, string> = {
  low: '낮은 경사',
  normal: '보통',
  high: '높은 경사',
};

const SAFETY_LABEL: Record<SafetyValue, string> = {
  low: '낮음',
  normal: '보통',
  high: '높음',
};

const FACILITY_LABEL: Record<FacilityValue, string> = {
  prefer: '있는 거 선호',
  none: '고려하지 않음',
};

type ModalKey =
  | 'distance'
  | 'route'
  | 'course'
  | 'lighting'
  | 'slope'
  | 'safety'
  | 'facility'
  | null;

export default function CoursePrefPage() {
  const [distance, setDistance] = useState<DistanceValue | null>(null);
  const [routeType, setRouteType] = useState<RouteTypeValue | null>(null);
  const [courseType, setCourseType] = useState<CourseTypeValue | null>(null);
  const [openModal, setOpenModal] = useState<ModalKey>(null);
  const navigate = useNavigate();

  const [lighting, setLighting] = useState<LightingValue | null>(null);
  const [slope, setSlope] = useState<SlopeValue | null>(null);
  const [safety, setSafety] = useState<SafetyValue | null>(null);
  const [facility, setFacility] = useState<FacilityValue | null>(null);

  const allRequiredSelected = !!(distance && routeType && courseType);
  const showExtras = courseType !== null;

  return (
    <div className="flex h-full w-full flex-col bg-surface-white pb-[110px]">
      <div className="px-6 pt-[3px]">
        <CourseStepBar currentStep={1} />
      </div>

      <div className="mt-[18px]">
        <div className="flex w-full gap-2 rounded-[12px] bg-gray-100 px-3.5 py-3">
          <span className={`text-gray-500 ${textStyles['caption-medium']}`}>
            ⓘ
          </span>
          <div className="flex flex-col gap-1">
            <p className={`text-text-primary ${textStyles['caption-medium']}`}>
              입력한 선호 조건은 AI가 코스를 추천할 때 반영돼요.
            </p>
            <p className={`text-gray-500 ${textStyles['footnote']}`}>
              거리, 경사도, 가로등 등 조건을 기반으로 나에게 맞는 코스를
              찾아드려요.
            </p>
            <p className={`text-gray-500 ${textStyles['footnote']}`}>
              선택하지 않은 항목은 기본값으로 설정돼요.
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-[19px] text-[15px] font-bold text-text-primary">
        선호 조건
      </h2>

      <div className="mt-3 flex flex-col gap-2">
        <PrefOptionCard
          iconBgClassName="bg-[#3CD457]/20"
          iconColorClassName="text-[#3CD457]"
          icon={<ArrowBothIcon />}
          title="목표 거리"
          selectedLabel={
            typeof distance === 'number' ? formatDistance(distance) : null
          }
          onClick={() => setOpenModal('distance')}
        />
        <PrefOptionCard
          iconBgClassName="bg-[#6145FF]/20"
          iconColorClassName="text-[#6145FF]"
          icon={<InfinityIcon />}
          title="왕복 / 편도"
          selectedLabel={routeType ? ROUTE_TYPE_LABEL[routeType] : null}
          onClick={() => setOpenModal('route')}
        />
        <PrefOptionCard
          iconBgClassName="bg-[#FF5A6D]/20"
          iconColorClassName="text-[#FF5A6D]"
          icon={<CategoryIcon />}
          title="코스 유형"
          selectedLabel={courseType ? COURSE_TYPE_LABEL[courseType] : null}
          onClick={() => setOpenModal('course')}
        />

        {showExtras && (
          <>
            <PrefOptionCard
              iconBgClassName="bg-[#FCDB65]/20"
              iconColorClassName="text-[#FCDB65]"
              icon={<BulbIcon />}
              title="조명 선호"
              selectedLabel={lighting ? LIGHTING_LABEL[lighting] : null}
              onClick={() => setOpenModal('lighting')}
            />
            <PrefOptionCard
              iconBgClassName="bg-[#FD903D]/20"
              iconColorClassName="text-[#FD903D]"
              icon={<SlopeIcon />}
              title="경사도"
              selectedLabel={slope ? SLOPE_LABEL[slope] : null}
              onClick={() => setOpenModal('slope')}
            />
            <PrefOptionCard
              iconBgClassName="bg-[#2F6AFF]/20"
              iconColorClassName="text-[#2F6AFF]"
              icon={<ShieldIcon />}
              title="안전"
              selectedLabel={safety ? SAFETY_LABEL[safety] : null}
              onClick={() => setOpenModal('safety')}
            />
            <PrefOptionCard
              iconBgClassName="bg-[#B037F6]/20"
              iconColorClassName="text-[#B037F6]"
              icon={<StoreIcon />}
              title="편의시설"
              selectedLabel={facility ? FACILITY_LABEL[facility] : null}
              onClick={() => setOpenModal('facility')}
            />
          </>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-9 z-30 mx-auto w-full max-w-[390px] px-5">
        <Button
          className="w-full"
          inactive={!allRequiredSelected}
          onClick={() => navigate('/course/main/step03')}
        >
          다음
        </Button>
      </div>

      <DistanceModal
        open={openModal === 'distance'}
        value={distance}
        onClose={() => setOpenModal(null)}
        onConfirm={(v) => {
          setDistance(v);
          setOpenModal(null);
        }}
      />
      <RouteTypeModal
        open={openModal === 'route'}
        value={routeType}
        onClose={() => setOpenModal(null)}
        onConfirm={(v) => {
          setRouteType(v);
          setOpenModal(null);
        }}
      />
      <CourseTypeModal
        open={openModal === 'course'}
        value={courseType}
        onClose={() => setOpenModal(null)}
        onConfirm={(v) => {
          setCourseType(v);
          setOpenModal(null);
        }}
      />
      <LightingModal
        open={openModal === 'lighting'}
        value={lighting}
        onClose={() => setOpenModal(null)}
        onConfirm={(v) => {
          setLighting(v);
          setOpenModal(null);
        }}
      />
      <SlopeModal
        open={openModal === 'slope'}
        value={slope}
        onClose={() => setOpenModal(null)}
        onConfirm={(v) => {
          setSlope(v);
          setOpenModal(null);
        }}
      />
      <SafetyModal
        open={openModal === 'safety'}
        value={safety}
        onClose={() => setOpenModal(null)}
        onConfirm={(v) => {
          setSafety(v);
          setOpenModal(null);
        }}
      />
      <FacilityModal
        open={openModal === 'facility'}
        value={facility}
        onClose={() => setOpenModal(null)}
        onConfirm={(v) => {
          setFacility(v);
          setOpenModal(null);
        }}
      />
    </div>
  );
}
