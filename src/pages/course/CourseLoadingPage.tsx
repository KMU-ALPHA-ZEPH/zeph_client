import { motion } from 'framer-motion';
import { textStyles } from '@/styles/tokens';

export default function CourseLoadingPage() {
  return (
    <div className="relative flex h-dvh w-full flex-col items-center ">
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <div className="relative grid size-[60px] place-items-center">
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/25"
            animate={{ scale: [1, 0.9, 1] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="flex flex-col items-center gap-5 px-5 text-center">
          <h1
            className={`text-text-primary ${textStyles['heading-h1']} leading-tight`}
          >
            AI가 <span className="text-primary">최적의 코스</span>를
            <br />
            생성하고 있어요
          </h1>
          <p className="text-[13px] leading-[22px] text-[#8c96a3]">
            입력하신 선호 조건을 분석하여
            <br />
            가장 적합한 코스를 찾고 있어요.
          </p>
        </div>
      </div>
    </div>
  );
}
