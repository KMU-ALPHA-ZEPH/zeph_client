/**
 * 트래킹 시뮬레이션 모드 판별.
 *
 * 데스크톱처럼 실제 GPS 가 없는 환경에서 러닝 흐름을 확인하려고 쓴다.
 * 주소에 `?sim=1` 을 한 번 붙여 접속하면 세션 동안 켜지고(`?sim=0` 으로 끔),
 * 켜져 있으면 TrackingStart 의 시작 위치 판정을 통과시키고,
 * TrackingActive 에서 추천 경로를 따라 위치를 자동으로 이동시킨다.
 */
const KEY = 'zeph_sim';

export function isSimMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sim') === '1') sessionStorage.setItem(KEY, '1');
    if (params.get('sim') === '0') sessionStorage.removeItem(KEY);
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}
