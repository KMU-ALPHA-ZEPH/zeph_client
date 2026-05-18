import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import NotFoundPage from './pages/NotFoundPage';
import PopularPage from './pages/popular/PopularPage';
import SplashPage from './pages/onboarding/SplashPage';
import StartPage from './pages/onboarding/StartPage';
import LoginPage from '@/pages/onboarding/LoginPage';
import EmptyLayout from '@/components/layout/EmptyLayout';
import FilterPage from '@/components/common/Header/FilterPage';
import StatsPage from '@/pages/stats/StatsPage';
import AccountModal from '@/components/AccountModal';

const queryClient = new QueryClient();

function ProfileLayout() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  return (
    <>
      <AppLayout
        headerVariant="profile"
        title="통계"
        onProfileClick={() => setIsAccountOpen(true)}
      />
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />
    </>
  );
}

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

        <Route element={<AppLayout headerVariant="back" title="상세 필터" />}>
          <Route path="/filter" element={<FilterPage />} />
        </Route>

        <Route element={<ProfileLayout />}>
          <Route path="/stats" element={<StatsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
