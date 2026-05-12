import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-5">
      <header>
        <h2>ZEPH</h2>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
