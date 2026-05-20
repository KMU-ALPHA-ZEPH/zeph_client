import { useState } from 'react';
import TabBar, { type TabBarKey } from '@/components/common/TabBar';

export default function CourseMainPage() {
  const [activeBottomTab, setActiveBottomTab] = useState<TabBarKey>('create');

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-10">
        <div className="mx-auto w-full max-w-[390px]">
          <div className="pointer-events-none h-4 bg-gradient-to-t from-surface-white to-transparent" />
          <TabBar
            activeTab={activeBottomTab}
            onTabChange={setActiveBottomTab}
          />
        </div>
      </div>
    </>
  );
}
