import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BackIcon } from '@/components/common/Icon/BackIcon';
import { MenuIcon } from '@/components/common/Icon/MenuIcon';
import MagnifyingGlassIcon from '@/assets/icons/magnifying-glass.svg?react';
import ProfileIcon from '@/assets/icons/profile_avatar.svg?react';
import SearchBar from '@/components/SearchBar';
import { textStyles } from '@/styles/tokens';

export type HeaderVariant = 'title' | 'back' | 'search' | 'profile' | 'add';

interface HeaderProps {
  variant?: HeaderVariant;
  title?: string;
  onBack?: () => void;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
  onAddClick?: () => void;
  searchValue?: string;
  onSearchValueChange?: (v: string) => void;
}

export default function Header({
  variant = 'title',
  title,
  onBack,
  onMenuClick,
  onSearchClick,
  onProfileClick,
  onAddClick,
  searchValue: searchValueProp,
  onSearchValueChange,
}: HeaderProps) {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [internalSearchValue, setInternalSearchValue] = useState('');

  const searchValue = searchValueProp ?? internalSearchValue;
  const setSearchValue = onSearchValueChange ?? setInternalSearchValue;

  if (variant === 'back') {
    const handleBack = onBack ?? (() => navigate(-1));
    return (
      <header className="flex h-[60px] w-full items-center gap-3 px-3">
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로 가기"
          className="flex size-7 items-center justify-center text-black"
        >
          <BackIcon className="size-6 text-black" />
        </button>
        {title && (
          <h1 className={`${textStyles['heading-h2']} text-black`}>{title}</h1>
        )}
      </header>
    );
  }

  if (variant === 'add') {
    return (
      <header className="flex h-[60px] w-full items-center justify-between px-[25px]">
        {title && (
          <h1 className={`${textStyles['heading-h1']} text-black`}>{title}</h1>
        )}
        <button
          type="button"
          aria-label="메뉴"
          onClick={onAddClick}
          className="grid h-6 w-6 place-items-center text-primary"
        >
          <MenuIcon />
        </button>
      </header>
    );
  }

  if (variant === 'profile') {
    return (
      <header className="flex h-[60px] w-full items-center justify-between px-[25px]">
        {title && (
          <h1 className={`${textStyles['heading-h1']} text-black`}>{title}</h1>
        )}
        <button
          type="button"
          aria-label="프로필"
          onClick={onProfileClick}
          className="grid h-8 w-8 place-items-center"
        >
          <ProfileIcon className="size-full" />
        </button>
      </header>
    );
  }

  if (variant === 'search') {
    return (
      <header className="flex h-[60px] w-full items-center justify-between gap-2 px-6">
        {title && (
          <h1
            className={`${textStyles['heading-h1']} flex-shrink-0 whitespace-nowrap text-black`}
          >
            {title}
          </h1>
        )}
        <motion.div
          initial={false}
          animate={{ width: searchOpen ? 240 : 44 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="-mr-3 flex h-11 items-center justify-end overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {searchOpen ? (
              <motion.div
                key="searchbar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: 0.1 }}
                className="w-full"
              >
                <SearchBar
                  value={searchValue}
                  onChange={setSearchValue}
                  autoFocus
                  onClose={() => setSearchOpen(false)}
                />
              </motion.div>
            ) : (
              <motion.button
                key="searchbtn"
                type="button"
                aria-label="검색"
                onClick={() => {
                  setSearchOpen(true);
                  onSearchClick?.();
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: 0.1 }}
                className="grid h-11 w-11 place-items-center text-black"
              >
                <MagnifyingGlassIcon className="size-6" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </header>
    );
  }

  return (
    <header className="flex h-[60px] w-full items-center justify-between px-6">
      {title && (
        <h1 className={`${textStyles['heading-h1']} text-black`}>{title}</h1>
      )}
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="메뉴 열기"
          className="ml-auto flex size-6 items-center justify-center text-black"
        >
          <MenuIcon />
        </button>
      )}
    </header>
  );
}
