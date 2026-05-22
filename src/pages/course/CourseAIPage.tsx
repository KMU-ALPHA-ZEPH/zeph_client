import { useState } from 'react';
import CourseStepBar from '@/pages/course/CourseStepBar';
import { textStyles } from '@/styles/tokens';
import AIPromptCard from '@/pages/course/AIPromptCard';
import AIPromptModal from '@/pages/course/OptionModal/AIPromptModal';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

export default function CourseAIPage() {
  const [prompt, setPrompt] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col bg-surface-white pb-[110px]">
      <div className="px-6 pt-[3px]">
        <CourseStepBar currentStep={prompt ? 3 : 2} />
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
        상세 설정
      </h2>

      <div className="mt-3 flex flex-col gap-2">
        <AIPromptCard hasPrompt={!!prompt} onClick={() => setOpen(true)} />
      </div>

      <div className="fixed inset-x-0 bottom-9 z-30 mx-auto w-full max-w-[390px] px-5">
        <Button className="w-full" onClick={() => navigate('/course/loading')}>
          다음
        </Button>
      </div>

      <AIPromptModal
        open={open}
        value={prompt}
        onClose={() => setOpen(false)}
        onConfirm={(v) => {
          setPrompt(v);
          setOpen(false);
        }}
      />
    </div>
  );
}
