import type { Metadata } from 'next';
import HostForm from '@/components/host/HostForm';

export const metadata: Metadata = {
  title: '發起球局｜PickleMatch',
  description: '建立你的匹克球局，招募球友一起開打',
};

export default function HostPage() {
  return <HostForm />;
}
