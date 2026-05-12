import ZephIcon from '@/assets/icons/zeph.svg?react';
import { Icon } from '@/components/common/Icon';
import TokensSample from '@/components/TokensSample';

export default function SamplePage() {
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <Icon as={ZephIcon} size="lg" className="bg-primary" />
      <Icon as={ZephIcon} size="sm" />
      <TokensSample></TokensSample>
    </div>
  );
}
