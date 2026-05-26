import { Outlet } from 'react-router-dom';
import Header, { type HeaderVariant } from '@/components/common/Header';

type AppLayoutProps = {
  headerVariant?: HeaderVariant;
  title?: string;
  onBack?: () => void;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
  onAddClick?: () => void;
};

export default function AppLayout({
  headerVariant = 'title',
  title,
  onBack,
  onMenuClick,
  onSearchClick,
  onProfileClick,
  onAddClick,
}: AppLayoutProps) {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col break-keep bg-surface-white">
      <Header
        variant={headerVariant}
        title={title}
        onBack={onBack}
        onMenuClick={onMenuClick}
        onSearchClick={onSearchClick}
        onProfileClick={onProfileClick}
        onAddClick={onAddClick}
      />
      <main className="flex flex-1 flex-col px-5 pb-[env(safe-area-inset-bottom)]">
        <Outlet />
      </main>
    </div>
  );
}
