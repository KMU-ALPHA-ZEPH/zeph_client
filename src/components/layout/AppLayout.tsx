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
      {/* iOS 노치 대응: 헤더를 sticky로 고정하고 위에 safe-area 만큼 흰 여백을 줘서
          헤더가 노치에 걸리지 않게 한다. 스크롤해도 노치 영역은 흰색으로 유지된다. */}
      <div className="sticky top-0 z-20 bg-surface-white pt-[env(safe-area-inset-top)]">
        <Header
          variant={headerVariant}
          title={title}
          onBack={onBack}
          onMenuClick={onMenuClick}
          onSearchClick={onSearchClick}
          onProfileClick={onProfileClick}
          onAddClick={onAddClick}
        />
      </div>
      <main className="flex flex-1 flex-col px-5 pb-[env(safe-area-inset-bottom)]">
        <Outlet />
      </main>
    </div>
  );
}
