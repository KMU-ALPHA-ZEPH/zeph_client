import { textStyles } from '@/styles/tokens';
import { AIIcon, ChevronRightIcon } from './icons';

type Props = {
  hasPrompt: boolean;
  onClick: () => void;
};

export default function AIPromptCard({ hasPrompt, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[60px] w-full items-center justify-between rounded-[10px] border-[0.5px] border-gray-200 bg-surface-white px-4 transition-colors duration-500 ease-out active:border-primary"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-[40px] shrink-0 place-items-center rounded-[5px] bg-[#FF6CFF]/10 text-[#FF6CFF]">
          <span className="block size-7">
            <AIIcon />
          </span>
        </span>
        <div className="flex flex-col items-start ">
          <span
            className={`text-text-primary ${textStyles['body-medium-med']}`}
          >
            AI 프롬프트 (선택)
          </span>
          <span className={`text-gray-500 ${textStyles['body-small']}`}>
            AI에게 추가로 전달할 요청사항
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className={`text-gray-500 ${textStyles['body-small']}`}>
          {hasPrompt ? '수정' : '설정'}
        </span>
        <span className="block size-[14px] text-text-primary">
          <ChevronRightIcon />
        </span>
      </div>
    </button>
  );
}
