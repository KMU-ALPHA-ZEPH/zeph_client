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
import CourseMainPage from '@/pages/course/CourseMainPage';
import FilterPage from '@/components/common/Header/FilterPage';
import CourseLocationPage from '@/pages/course/CourseLocationPage';
import CoursePrefPage from '@/pages/course/CoursePrefPage';
import CourseAIPage from '@/pages/course/CourseAIPage';
import CourseLoadingPage from '@/pages/course/CourseLoadingPage';

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
          <Route path="/course/main" element={<CourseMainPage />} />
          <Route path="/course/main/step04" element={<CourseLoadingPage />} />
          <Route path="/filter" element={<FilterPage />} />
          <Route path="course/loading" element={<CourseLoadingPage />} />
        </Route>

        {/* 헤더 있는 레이아웃 */}
        <Route element={<AppLayout headerVariant="search" title="인기 코스" />}>
          <Route path="/popular-page" element={<PopularPage />} />
        </Route>

        <Route
          element={<AppLayout headerVariant="back" title="코스 생성하기" />}
        >
          <Route path="/popular" element={<PopularPage />} />
          <Route path="/course/main/step01" element={<CourseLocationPage />} />
          <Route path="/course/main/step02" element={<CoursePrefPage />} />
          <Route path="/course/main/step03" element={<CourseAIPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
