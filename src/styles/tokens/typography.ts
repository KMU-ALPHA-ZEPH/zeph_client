/**
 * 텍스트 스타일 프리셋. 자주 쓰는 조합은 컴포넌트 className에 직접 붙여 사용
 */
export const textStyles = {
  'display-hero': 'text-display font-normal',
  'heading-h1': 'text-h1 font-bold',
  'heading-h2': 'text-h2 font-bold',
  'heading-h3': 'text-h3 font-bold',
  'heading-h3-onboarding': 'text-h3 font-medium leading-7',
  'body-large': 'text-body-lg font-medium',
  'body-medium': 'text-body-md font-normal',
  'body-medium-med': 'text-body-md font-medium',
  'body-medium-bold': 'text-body-md font-bold',
  'body-small': 'text-body-sm font-normal',
  'body-small-med': 'text-body-sm font-medium',
  'caption-default': 'text-caption font-normal leading-4',
  'caption-medium': 'text-caption font-medium',
  footnote: 'text-footnote font-normal',
  tab: 'text-tab font-normal',
  'number-large': 'text-number-lg font-normal',
  'number-medium': 'text-number-md font-normal',
} as const;
