import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import ProfileLayout from '@/components/layout/ProfileLayout';
import EmptyLayout from '@/components/layout/EmptyLayout';
import NotFoundPage from './pages/NotFoundPage';
import PopularPage from './pages/popular/PopularPage';
import SplashPage from './pages/onboarding/SplashPage';
import StartPage from './pages/onboarding/StartPage';
import LoginPage from '@/pages/onboarding/LoginPage';
import FilterPage from '@/pages/popular/FilterPage';
import StatsPage from '@/pages/stats/StatsPage';
import ScrapPage from '@/pages/scrap/ScrapPage';
import ScrapDetailPage from '@/pages/scrap/ScrapDetailPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<EmptyLayout />}>
          <Route path="/" element={<Navigate to="/start" replace />} />
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<AppLayout headerVariant="search" title="인기 코스" />}>
          <Route path="/popular-page" element={<PopularPage />} />
        </Route>

        <Route element={<AppLayout headerVariant="back" title="상세 필터" />}>
          <Route path="/filter" element={<FilterPage />} />
        </Route>

        <Route element={<ProfileLayout title="통계" />}>
          <Route path="/stats" element={<StatsPage />} />
        </Route>

        <Route element={<AppLayout headerVariant="add" title="스크랩" />}>
          <Route path="/scrap" element={<ScrapPage />} />
        </Route>

        <Route element={<EmptyLayout />}>
          <Route path="/scrap/:id" element={<ScrapDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
