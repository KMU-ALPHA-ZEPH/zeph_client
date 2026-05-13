import { useState } from 'react';
import { textStyles } from '@/styles/tokens';

interface TermsModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const rows: { label: string; content: string }[] = [
  { label: '수집하는 개인정보 항목', content: '닉네임, 이메일' },
  {
    label: '위치정보 수집 및 이용',
    content: '현재 위치(위도, 경도) 수집 및 코스 생성,\n코스 탐색에 이용',
  },
  {
    label: '이용 목적',
    content: '회원 식별, 서비스 제공 및 개선,\n고객 문의 응대',
  },
  { label: '보유 및 이용 기간', content: '회원 탈퇴 시 또는 동의 철회 시까지' },
  {
    label: '동의를 거부할 권리 및\n불이익',
    content:
      '동의를 거부하실 수 있으며, 동의 거부 시\n서비스 이용이 제한될 수 있습니다.',
  },
];

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  uncheckedBorder: string;
}

function Checkbox({ checked, onChange, uncheckedBorder }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`mt-px flex size-4 shrink-0 items-center justify-center rounded-[3px] border ${
        checked
          ? 'border-black bg-black'
          : `${uncheckedBorder} bg-surface-white`
      }`}
    >
      {checked && (
        <svg viewBox="0 0 16 16" className="size-3" fill="none">
          <path
            d="M3.5 8.5L6.5 11.5L12.5 5.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

export default function TermsModal({ onClose, onConfirm }: TermsModalProps) {
  const [requiredChecked, setRequiredChecked] = useState(false);
  const [optionalChecked, setOptionalChecked] = useState(false);

  const canConfirm = requiredChecked && optionalChecked;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-8">
      <div className="flex w-full max-w-[320px] flex-col gap-5 overflow-hidden rounded-[20px] bg-surface-white px-6 pb-6 pt-7">
        <div className="flex w-full flex-col gap-2">
          <p className={`${textStyles['heading-h3']} text-black`}>
            개인정보 처리 동의
          </p>
          <p className={`${textStyles['body-small']} text-gray-500`}>
            서비스 이용을 위해 아래의 개인정보 처리 내용을
            <br />
            확인하고 동의해 주세요.
          </p>
        </div>

        <div
          className={`${textStyles.footnote} flex w-full flex-col border-t border-gray-200`}
        >
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex w-full items-start gap-3 border-b border-gray-200 py-2"
            >
              <p className="w-[110px] whitespace-pre-line text-black">
                {row.label}
              </p>
              <p className="flex-1 whitespace-pre-line text-gray-500">
                {row.content}
              </p>
            </div>
          ))}
        </div>

        <div className={`${textStyles.footnote} flex w-full flex-col`}>
          <div className="flex w-full items-start gap-3 border-b border-gray-200 py-[14px]">
            <Checkbox
              checked={requiredChecked}
              onChange={() => setRequiredChecked((v) => !v)}
              uncheckedBorder="border-black"
            />
            <div className="flex flex-1 flex-col gap-1.5">
              <p className="text-black">
                위의 개인정보 처리 내용에 모두 동의합니다.
              </p>
              <p className="text-text-placeholder">
                선택 항목에 동의하지 않아도 서비스 이용은 가능하나,
                <br />
                일부 기능 이용이 제한될 수 있습니다.
              </p>
            </div>
          </div>
          <div className="flex w-full items-start gap-3 py-[14px]">
            <Checkbox
              checked={optionalChecked}
              onChange={() => setOptionalChecked((v) => !v)}
              uncheckedBorder="border-gray-500"
            />
            <div className="flex flex-1 flex-col gap-1.5">
              <p className="text-gray-500">
                (선택) 서비스 개선을 위한 이용 데이터 수집 동의
              </p>
              <p className="text-text-placeholder">
                서비스 이용 현황 분석 및 개선을 위해 익명으로 수집·이용됩니다.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full items-start gap-2">
          <button
            type="button"
            onClick={onClose}
            className={`${textStyles['body-medium']} flex h-[39px] flex-1 items-center justify-center rounded-[5px] border border-gray-200 bg-surface-white text-black transition-transform active:scale-[0.97]`}
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`${textStyles['body-medium']} cursor-pointer flex h-[39px] flex-1 items-center justify-center rounded-[5px] bg-black text-white transition-transform ${
              canConfirm ? 'active:scale-[0.97]' : 'opacity-40'
            }`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
