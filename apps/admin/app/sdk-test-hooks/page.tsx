'use client';

import { useAuth, useSDK, useTenantsList } from '@repo/sdk/react';
import { useState } from 'react';

import {
  useHealth,
  useUsersList,
  type TenantResponse,
  type UserResponse,
} from '@repo/sdk';

export default function SDKHooksTestPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Initialize SDK
  const sdk = useSDK({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100',
  });

  // Health check (auto-fetches on mount)
  const health = useHealth();

  // Auth hooks
  const auth = useAuth(sdk);

  // Users hooks
  const usersList = useUsersList(
    {
      pagination: { page: 1, perPage: 10 },
    },
    {
      enabled: true,
    },
  );

  // Tenants hooks
  const tenants = useTenantsList(sdk, {
    pagination: { page: 1, perPage: 10 },
  });

  const handleLogin = async () => {
    await auth.login.execute({
      email: 'mail@mail.com',
      password: '12345678',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col gap-8 py-16 px-8 bg-white dark:bg-black">
        <div>
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-2">
            SDK Hooks Test Page
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Testing React hooks with automatic state management
          </p>
        </div>

        {/* Health Check */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
            Health Check (Auto-fetch)
          </h2>
          {health.check.loading && <p>Loading...</p>}
          {health.check.error && (
            <p className="text-red-600">Error: {health.check.error.message}</p>
          )}
          {health.check.data && (
            <p className="text-green-600">Status: {health.check.data.status}</p>
          )}
          <button
            onClick={() => health.check.fetch()}
            className="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Auth */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
            Authentication
          </h2>
          <button
            onClick={handleLogin}
            disabled={auth.login.loading}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {auth.login.loading ? 'Logging in...' : 'Login'}
          </button>
          {auth.login.error && (
            <p className="mt-2 text-red-600">{auth.login.error.message}</p>
          )}
          {auth.login.success && auth.login.data && (
            <p className="mt-2 text-green-600">
              Login successful! Token:{' '}
              {auth.login.data.accessToken.substring(0, 30)}...
            </p>
          )}
        </div>

        {/* Users List */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
            Users List (Auto-fetch)
          </h2>
          {usersList.loading && <p>Loading users...</p>}
          {usersList.error && (
            <p className="text-red-600">Error: {usersList.error.message}</p>
          )}
          {usersList.data && (
            <div className="space-y-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Total: {usersList.data.total} users
              </p>
              {usersList.data.items.map((u: UserResponse) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded border border-zinc-200 dark:border-zinc-800 p-4"
                >
                  <div>
                    <p className="font-medium text-black dark:text-zinc-50">
                      {u.name || u.userName || 'No name'}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {u.role || 'N/A'} | {u.status || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedUserId(u.id)}
                    className="px-3 py-1 rounded bg-blue-600 text-white text-xs"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => usersList.fetch()}
            className="mt-4 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Refresh
          </button>
        </div>

        {/* Single User */}
        {selectedUserId && (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
              User Details (Auto-fetch when ID changes)
            </h2>
            {usersList.loading && <p>Loading user...</p>}
            {usersList.error && (
              <p className="text-red-600">Error: {usersList.error.message}</p>
            )}
            {usersList.data && (
              <div>
                <p className="font-medium text-black dark:text-zinc-50">
                  {usersList.data.items[0].name ||
                    usersList.data.items[0].userName}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  ID: {usersList.data.items[0].id}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Role: {usersList.data.items[0].role || 'N/A'}
                </p>
              </div>
            )}
            <button
              onClick={() => setSelectedUserId(null)}
              className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Tenants List */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
            Tenants List (Auto-fetch)
          </h2>
          {tenants.loading && <p>Loading tenants...</p>}
          {tenants.error && (
            <p className="text-red-600">Error: {tenants.error.message}</p>
          )}
          {tenants.data && (
            <div className="space-y-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Total: {tenants.data.total} tenants
              </p>
              {tenants.data.items.map((tenant: TenantResponse) => (
                <div
                  key={tenant.id}
                  className="rounded border border-zinc-200 dark:border-zinc-800 p-4"
                >
                  <p className="font-medium text-black dark:text-zinc-50">
                    {tenant.name || 'No name'}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {tenant.slug || 'N/A'} | {tenant.status || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => tenants.fetch()}
            className="mt-4 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Refresh
          </button>
        </div>

        {/* Info */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong>API URL:</strong>{' '}
            {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100/api/v1'}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            Using React hooks for automatic state management (loading, error,
            data)
          </p>
        </div>
      </main>
    </div>
  );
}
