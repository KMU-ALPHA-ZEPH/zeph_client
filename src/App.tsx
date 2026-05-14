import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import NotFoundPage from './pages/NotFoundPage';
import PopularPage from './pages/popular/PopularPage';
import SplashPage from './pages/onboarding/SplashPage';
import StartPage from './pages/onboarding/StartPage';
import LoginPage from '@/pages/onboarding/LoginPage';
import EmptyLayout from '@/components/layout/EmptyLayout';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* 헤더 없는 레이아웃 */}
        <Route element={<EmptyLayout />}>
          <Route path="/" element={<Navigate to="/start" replace />} />
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* 헤더 있는 레이아웃 */}
        <Route element={<AppLayout headerVariant="search" title="인기 코스" />}>
          <Route path="/popular-page" element={<PopularPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
