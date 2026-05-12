import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import SamplePage from './pages/SamplePage';
import NotFoundPage from './pages/NotFoundPage';
import SplashPage from './pages/onboarding/SplashPage';
import StartPage from './pages/onboarding/StartPage';
import LoginPage from '@/pages/onboarding/LoginPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* 기본 루트 */}
        <Route path="/" element={<Navigate to="/splash" replace />} />

        <Route path="/splash" element={<SplashPage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 공통 레이아웃 */}
        <Route element={<AppLayout />}>
          <Route path="/sample" element={<SamplePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
