import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import SamplePage from './pages/SamplePage';
import NotFoundPage from './pages/NotFoundPage';
import CourseCardPreviewPage from './pages/CourseCardPreviewPage';
import PopularWayPage from './pages/PopularWayPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* 기본 루트 */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* 공통 레이아웃 */}
        <Route element={<AppLayout />}>
          <Route path="/sample" element={<SamplePage />} />
          <Route path="/course-preview" element={<CourseCardPreviewPage />} />
          <Route path="/popular-way" element={<PopularWayPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
