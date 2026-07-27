'use client';

import { clearAuthData } from '@/utils/api';
import { useRouter } from 'next/navigation';

interface SignOutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function SignOutButton({ className, children }: SignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    await clearAuthData();
    router.push('/login');
    router.refresh();
  }

  return (
    <button onClick={handleSignOut} className={className}>
      {children ?? 'Sign Out'}
    </button>
  );
}
