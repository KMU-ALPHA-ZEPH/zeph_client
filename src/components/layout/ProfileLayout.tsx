import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AccountModal from '@/components/AccountModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { getUser, logout, saveUser } from '@/lib/auth';
import { deleteAccount, updateProfile } from '@/apis/auth';

type Props = {
  title?: string;
};

export default function ProfileLayout({ title = '통계' }: Props) {
  const navigate = useNavigate();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [user, setUser] = useState(getUser());

  const handleLogout = async () => {
    setIsLogoutOpen(false);
    setIsAccountOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const handleDelete = async () => {
    if (!user?.id) {
      alert('사용자 정보를 찾을 수 없습니다. 다시 로그인 후 시도해주세요.');
      return;
    }
    try {
      await deleteAccount(user.id);
      await logout();
      navigate('/login', { replace: true });
    } catch {
      alert('계정 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleProfileSubmit = async ({
    nickname,
    avatarUrl,
  }: {
    nickname: string;
    avatarUrl?: string;
  }) => {
    if (!user?.id) {
      alert('사용자 정보를 찾을 수 없습니다. 다시 로그인 후 시도해주세요.');
      return;
    }
    try {
      await updateProfile(user.id, {
        name: nickname,
        profile_image_url: avatarUrl,
      });
      const next = {
        ...user,
        name: nickname,
        profile_image_url: avatarUrl,
      };
      saveUser(next);
      setUser(next);
    } catch {
      alert('프로필 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

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
        name={user?.name}
        email={user?.email}
        avatarUrl={user?.profile_image_url}
        onLogoutClick={() => setIsLogoutOpen(true)}
        onDeleteClick={() => setIsDeleteOpen(true)}
        onProfileSubmit={handleProfileSubmit}
      />
      <ConfirmModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        title="로그아웃 하시겠습니까?"
        confirmLabel="로그아웃"
        cancelLabel="취소"
        onConfirm={handleLogout}
      />
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="정말 계정을 삭제하시겠습니까?"
        message="삭제 후에는 복구할 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleDelete}
      />
    </>
  );
}
