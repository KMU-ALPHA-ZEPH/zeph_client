import TabBar, {
  type TabBarKey,
  useTabBarNavigation,
} from '@/components/common/TabBar';

type Props = {
  activeTab: TabBarKey;
  showGradient?: boolean;
};

export default function TabBarLayout({
  activeTab,
  showGradient = true,
}: Props) {
  const navigateTab = useTabBarNavigation();
  return (
    <div className="fixed inset-x-0 bottom-0 z-10">
      <div className="mx-auto w-full max-w-[390px]">
        {showGradient && (
          <div className="pointer-events-none h-4 bg-gradient-to-t from-surface-white to-transparent" />
        )}
        <TabBar activeTab={activeTab} onTabChange={navigateTab} />
      </div>
    </div>
  );
}
