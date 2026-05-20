import { textStyles } from '@/styles/tokens';
import CourseStepBar from './CourseStepBar';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

export default function CoursePrefPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col bg-surface-white pb-9">
      <div className="px-6 pt-[3px]">
        <CourseStepBar currentStep={1} />
      </div>

      <p
        className={`mt-[26px] text-text-secondary ${textStyles['body-small']}`}
      >
        선호 조건을 선택해주세요.
      </p>

      <div className="mt-auto flex justify-center px-[35px]">
        <Button
          className="absolute bottom-[50px] w-[340px]"
          onClick={() => navigate('/course/main/step02')}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
