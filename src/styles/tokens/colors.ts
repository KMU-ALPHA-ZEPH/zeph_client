/**
 * JS에서 색 직접 쓸 때만 사용 (Framer Motion, Recharts 등)
 * 평소엔 Tailwind 클래스 우선
 */
export const colors = {
  primary: {
    DEFAULT: 'var(--color-primary)',
    tint: 'var(--color-primary-tint)',
  },
  black: 'var(--color-black)',
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    placeholder: 'var(--color-text-placeholder)',
    onPrimary: 'var(--color-text-on-primary)',
  },
  gray: {
    100: 'var(--color-gray-100)',
    200: 'var(--color-gray-200)',
    300: 'var(--color-gray-300)',
    400: 'var(--color-gray-400)',
    500: 'var(--color-gray-500)',
  },
  surface: {
    white: 'var(--color-surface-white)',
    gray: 'var(--color-surface-gray)',
  },
  status: {
    error: 'var(--color-status-error)',
    info: 'var(--color-status-info)',
    success: 'var(--color-status-success)',
  },
  overlay: {
    base: 'var(--color-overlay-base)',
  },
} as const;
