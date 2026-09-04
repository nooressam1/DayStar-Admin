'use client';

import { createClient } from '@/utils/supabase/client';
import { clearAuthData } from '@/utils/api';
import { isUserAdmin } from '@/utils/supabase/isUserAdmin';

export { isUserAdmin };

/**
 * Custom hook providing admin authentication actions
 */
export function useAdminAuth() {
  /**
   * Authenticates user via email/password and verifies admin privileges
   */
  async function loginAsAdmin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = data.user;
    if (!isUserAdmin(user)) {
      await clearAuthData();
      throw new Error(
        "Access denied. Your account is missing the 'admin' role in Supabase App Metadata."
      );
    }

    return data;
  }

  return {
    loginAsAdmin,
    isUserAdmin,
  };
}
