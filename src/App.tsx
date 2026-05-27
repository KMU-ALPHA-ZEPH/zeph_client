import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import ProfileLayout from '@/components/layout/ProfileLayout';
import NotFoundPage from './pages/NotFoundPage';
import PopularPage from './pages/popular/PopularPage';
import SplashPage from './pages/onboarding/SplashPage';
import StartPage from './pages/onboarding/StartPage';
import LoginPage from '@/pages/onboarding/LoginPage';
import FilterPage from '@/pages/popular/FilterPage';
import StatsPage from '@/pages/stats/StatsPage';
import ScrapPage from '@/pages/scrap/ScrapPage';
import ScrapDetailPage from '@/pages/scrap/ScrapDetailPage';
import EmptyLayout from '@/components/layout/EmptyLayout';
import CourseMainPage from '@/pages/course/CourseMainPage';
import CourseLocationPage from '@/pages/course/CourseLocationPage';
import CoursePrefPage from '@/pages/course/CoursePrefPage';
import CourseAIPage from '@/pages/course/CourseAIPage';
import CourseLoadingPage from '@/pages/course/CourseLoadingPage';
import CourseDetailPage from '@/pages/course/CourseDetailPage';

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
          <Route path="/course/main" element={<CourseMainPage />} />
          <Route path="/course/main/step04" element={<CourseLoadingPage />} />
          <Route path="course/loading" element={<CourseLoadingPage />} />
          <Route path="/course/detail" element={<CourseDetailPage />} />
          {/*<Route path="/tracking/start" element={<CourseDetailPage />} />*/}
        </Route>

        <Route
          element={<AppLayout headerVariant="back" title="코스 생성하기" />}
        >
          <Route path="/popular" element={<PopularPage />} />
          <Route path="/course/main/step01" element={<CourseLocationPage />} />
          <Route path="/course/main/step02" element={<CoursePrefPage />} />
          <Route path="/course/main/step03" element={<CourseAIPage />} />
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

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
