import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AxiosError } from 'axios';
import { textStyles } from '@/styles/tokens';
import { recommendCourse } from '@/apis/courses';
import { buildRecommendRequest, useCourseStore } from '@/stores/courseStore';

const NEXT_PATH = '/course/detail';
const MIN_LOADING_MS = 1500; // 최소 로딩 연출 시간
const SLOW_HINT_SEC = 15; // 이 시간 지나면 "조금만 기다려 주세요" 보조 문구
const CANCEL_AFTER_SEC = 90; // 이 시간 지나면 취소 버튼 노출

export default function CourseLoadingPage() {
  const navigate = useNavigate();
  const form = useCourseStore((s) => s.form);
  const setResult = useCourseStore((s) => s.setResult);
  const [failed, setFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [needsLocation, setNeedsLocation] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // 경과 시간 타이머 — 보조 문구/취소 버튼 노출 시점 판단용
  useEffect(() => {
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // 사용자가 직접 취소: 진행 중인 요청을 중단하고 이전 화면으로
  const handleCancel = () => {
    abortRef.current?.abort();
    navigate(-1);
  };

  useEffect(() => {
    let alive = true;
    const startedAt = Date.now();
    const controller = new AbortController();
    abortRef.current = controller;

    // 최소 연출 시간을 보장하면서 추천 API 결과를 기다린다.
    const wait = (ms: number) =>
      new Promise((r) => setTimeout(r, Math.max(0, ms)));

    (async () => {
      const requestBody = buildRecommendRequest(form);

      // 시작 위치가 없으면(0,0) AI 서버가 경로를 못 만든다 → 호출 자체를 막고 안내
      if (!requestBody.startLat || !requestBody.startLng) {
        setNeedsLocation(true);
        setErrorMsg(
          '시작 위치가 설정되지 않았어요. 위치 단계부터 다시 진행해 주세요.',
        );
        setFailed(true);
        return;
      }

      try {
        const result = await recommendCourse(requestBody, controller.signal);
        await wait(MIN_LOADING_MS - (Date.now() - startedAt));
        if (!alive) return;
        setResult(result);
        navigate(NEXT_PATH, { replace: true });
      } catch (e) {
        // 사용자가 취소한 경우엔 에러 화면을 띄우지 않는다.
        if (e instanceof AxiosError && e.code === 'ERR_CANCELED') return;
        // 진단용: 서버가 내려준 상태코드 + 응답 본문을 그대로 노출
        if (e instanceof AxiosError) {
          console.error(
            '[recommend] failed',
            e.response?.status,
            e.response?.data,
          );
          const data = e.response?.data as { message?: string } | undefined;
          setErrorMsg(
            data?.message ?? e.message ?? '알 수 없는 오류가 발생했어요.',
          );
        } else {
          console.error('[recommend] failed', e);
          setErrorMsg('알 수 없는 오류가 발생했어요.');
        }
        if (alive) setFailed(true);
      }
    })();

    return () => {
      alive = false;
      controller.abort(); // 언마운트 시 진행 중 요청 정리
    };
  }, [form, setResult, navigate]);

  if (failed) {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-6 px-8 text-center">
        <h1
          className={`text-text-primary ${textStyles['heading-h2']} leading-tight`}
        >
          코스를 생성하지 못했어요
        </h1>
        <p className="text-[13px] leading-[22px] text-[#8c96a3]">
          {needsLocation
            ? '시작 위치를 먼저 설정해 주세요.'
            : '잠시 후 다시 시도해 주세요.'}
        </p>
        {errorMsg && (
          <p className="max-w-[300px] break-words rounded-lg bg-gray-100 px-3 py-2 text-[12px] leading-[18px] text-status-error">
            {errorMsg}
          </p>
        )}
        <button
          type="button"
          onClick={() =>
            needsLocation ? navigate('/course/main') : navigate(-1)
          }
          className={`rounded-full bg-primary px-6 py-2.5 text-white ${textStyles['body-small-med']}`}
        >
          {needsLocation ? '위치 설정하러 가기' : '돌아가기'}
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex h-dvh w-full flex-col items-center "
    >
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
              duration: 4.0,
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

          {/* 일정 시간 지나면 안심 문구 */}
          {elapsedSec >= SLOW_HINT_SEC && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[12px] leading-[20px] text-primary"
            >
              예상보다 조금 오래 걸리고 있어요.
              <br />
              조금만 기다려 주세요 :)
            </motion.p>
          )}
        </div>
      </div>

      {/* 너무 오래 걸리면 취소 버튼 노출 */}
      {elapsedSec >= CANCEL_AFTER_SEC && (
        <motion.button
          type="button"
          onClick={handleCancel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute bottom-12 rounded-full border border-gray-300 px-6 py-2.5 text-text-secondary ${textStyles['body-small-med']}`}
        >
          취소하기
        </motion.button>
      )}
    </motion.div>
  );
}
