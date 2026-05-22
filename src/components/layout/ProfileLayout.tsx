import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import AccountModal from '@/components/AccountModal';

type Props = {
  title?: string;
};

export default function ProfileLayout({ title = '통계' }: Props) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  return (
    <>
      <AppLayout
        headerVariant="profile"
        title={title}
        onProfileClick={() => setIsAccountOpen(true)}
      />
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />
    </>
  );
}
