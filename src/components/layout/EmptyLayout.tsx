import { Outlet } from 'react-router-dom';

export default function EmptyLayout() {
  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-[390px] bg-surface-white">
      <Outlet />
    </div>
  );
}
