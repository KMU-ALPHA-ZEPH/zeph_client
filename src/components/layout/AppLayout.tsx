import { Outlet } from 'react-router-dom';
import Header from '@/components/common/Header';

type AppLayoutProps = {
  headerVariant?: 'title' | 'back';
  title?: string;
};

export default function AppLayout({
  headerVariant = 'title',
  title,
}: AppLayoutProps) {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col break-keep bg-surface-white">
      <Header variant={headerVariant} title={title} />
      <main className="flex flex-1 flex-col px-5 pb-[env(safe-area-inset-bottom)]">
        <Outlet />
      </main>
    </div>
  );
}
