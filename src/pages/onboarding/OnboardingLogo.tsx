import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ZephIcon from '@/assets/icons/zeph.svg?react';

const POSITIONS: Record<string, { top: string; size: number }> = {
  '/start': { top: '38%', size: 100 },
  '/login': { top: '18%', size: 100 },
  '/splash': { top: '40%', size: 150 },
};

export default function OnboardingLogo() {
  const location = useLocation();
  const cfg = POSITIONS[location.pathname];
  if (!cfg) return null;

  return (
    <motion.div
      initial={false}
      animate={{ top: cfg.top, width: cfg.size, height: cfg.size }}
      transition={{ type: 'tween', duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
      className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2"
    >
      <ZephIcon width="100%" height="100%" />
    </motion.div>
  );
}
