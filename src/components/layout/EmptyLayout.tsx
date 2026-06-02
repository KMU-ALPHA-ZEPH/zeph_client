import { Outlet } from 'react-router-dom';
import OnboardingLogo from '@/pages/onboarding/OnboardingLogo';

export default function EmptyLayout() {
  return (
    <div className="relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden break-keep bg-surface-white">
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
      <OnboardingLogo />
    </div>
  );
}
