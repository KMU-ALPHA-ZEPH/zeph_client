import { Outlet } from 'react-router-dom';

export default function EmptyLayout() {
  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-[390px] flex-col break-keep bg-surface-white">
      <main className="flex flex-1 flex-col pb-[env(safe-area-inset-bottom)]">
        <Outlet />
      </main>
    </div>
  );
}
