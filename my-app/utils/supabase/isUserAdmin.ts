import { User } from '@supabase/supabase-js';

/**
 * Helper function to verify if a user has admin privileges via app_metadata
 */
export function isUserAdmin(
  user: User | { app_metadata?: { role?: string } } | null | undefined
): boolean {
  if (!user) return false;
  return user.app_metadata?.role === 'admin';
}
