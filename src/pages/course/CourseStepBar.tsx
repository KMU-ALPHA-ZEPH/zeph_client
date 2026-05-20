import { textStyles } from '@/styles/tokens';

type Step = { key: string; label: string };

const STEPS: Step[] = [
  { key: 'location', label: '위치' },
  { key: 'pref', label: '선호 조건' },
  { key: 'detail', label: '상세 설정' },
];

function CheckCircle() {
  return (
    <svg viewBox="0 0 21 21" fill="none" className="size-full">
      <circle cx="10.5" cy="10.5" r="10.5" fill="currentColor" />
      <path
        d="M6 10.8L9 13.8L15 7.8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  currentStep: number;
};

export default function CourseStepBar({ currentStep }: Props) {
  return (
    <div className="flex w-full items-center justify-between">
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum <= currentStep;
        return (
          <div key={step.key} className="flex items-center gap-1.5">
            <span className="relative block size-[21px]">
              <span
                className={`absolute inset-0 grid place-items-center rounded-full bg-gray-300 text-gray-500 transition-opacity duration-1000 ease-out ${textStyles['body-small']} ${
                  isActive ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {stepNum}
              </span>
              <span
                className={`absolute inset-0 text-primary transition-opacity duration-1000 ease-out ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <CheckCircle />
              </span>
            </span>
            <span
              className={`whitespace-nowrap transition-colors duration-1000 ease-out ${textStyles['body-small-med']} ${
                isActive ? 'text-text-primary' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
            {idx < STEPS.length - 1 && (
              <span className="relative mx-1 block h-px w-[30px] overflow-hidden bg-gray-300">
                <span
                  className="absolute inset-y-0 left-0 origin-left bg-primary transition-transform duration-[1500ms] ease-out"
                  style={{
                    width: '100%',
                    transform: `scaleX(${stepNum <= currentStep ? 1 : 0})`,
                  }}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
