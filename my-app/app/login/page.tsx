'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAsAdmin } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Show error if redirected here due to unauthorized access
  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setError('Access denied. Only admin accounts can access this dashboard.');
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginAsAdmin({ email, password });
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-4">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header accent */}
        <div className="h-2 bg-gradient-to-r from-[#8B6F4E] to-[#C4A882]" />

        <div className="p-8">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#8B6F4E] tracking-tight">
              DayStar
            </h1>
            <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="admin@daystar.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#8B6F4E] focus:ring-2 focus:ring-[#8B6F4E]/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#8B6F4E] focus:ring-2 focus:ring-[#8B6F4E]/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#8B6F4E] hover:bg-[#7A6145] text-white rounded-lg py-2.5 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer text */}
      <p className="text-center text-xs text-gray-400 mt-6">
        Admin access only. Contact your administrator if you need an account.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF5F2]">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#8B6F4E] to-[#C4A882]" />
              <div className="p-8 text-center text-gray-400">Loading…</div>
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
