import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div style={{ padding: '24px' }}>
      <header>
        <h2>ZEPH</h2>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
