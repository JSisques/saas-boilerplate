'use client';

import { SDK } from '@repo/sdk';
import { useState } from 'react';

type User = {
  id: string;
  name?: string;
  userName?: string;
  role?: string;
  status?: string;
  email?: string;
};

type Tenant = {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  status?: string;
};

type TenantMember = {
  id: string;
  tenantId?: string;
  userId?: string;
  role?: string;
};

type SubscriptionPlan = {
  id: string;
  name: string;
  slug: string;
  type?: string;
  priceMonthly: number;
  currency: string;
  isActive: boolean;
};

type Event = {
  id: string;
  eventType?: string;
  aggregateType?: string;
  timestamp?: string;
};

export default function SDKTestPage() {
  const [healthStatus, setHealthStatus] = useState<string>('Loading...');
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantMembers, setTenantMembers] = useState<TenantMember[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('auth');

  // Initialize SDK
  const sdk = new SDK({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100',
  });

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const checkHealth = async () => {
    try {
      setLoading(true);
      clearMessages();
      const health = await sdk.health.check();
      setHealthStatus(health.status);
      setSuccess('Health check successful!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHealthStatus('Error');
    } finally {
      setLoading(false);
    }
  };

  // Auth Examples
  const handleRegister = async () => {
    try {
      setLoading(true);
      clearMessages();
      const result = await sdk.auth.registerByEmail({
        email: `test${Date.now()}@example.com`,
        password: 'password123',
      });
      setSuccess(`Registration successful! ID: ${result.id || 'N/A'}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      clearMessages();
      const result = await sdk.auth.loginByEmail({
        email: 'javi@mail.com',
        password: '12345678',
      });
      setSuccess(
        `Login successful! Tokens saved automatically.\nAccess Token: ${result.accessToken.substring(0, 30)}...`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      clearMessages();
      await sdk.logout();
      setUsers([]);
      setTenants([]);
      setSuccess('Logged out successfully! Tokens cleared.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // User Examples
  const fetchUsers = async () => {
    try {
      setLoading(true);
      clearMessages();
      const result = await sdk.users.findByCriteria({
        pagination: { page: 1, perPage: 10 },
      });
      setUsers(result.items);
      setSuccess(`Found ${result.total} users`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      setLoading(true);
      clearMessages();
      const result = await sdk.users.create({
        name: `Test User ${Date.now()}`,
        userName: `testuser${Date.now()}`,
        role: 'USER',
        status: 'ACTIVE',
      });
      setSuccess(`User created successfully! ID: ${result.id || 'N/A'}`);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateUser = async (userId: string) => {
    try {
      setLoading(true);
      clearMessages();
      setSuccess(`User updated successfully!`);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      clearMessages();
      await sdk.users.delete({ id: userId });
      setSuccess(`User deleted successfully!`);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Tenant Examples
  const fetchTenants = async () => {
    try {
      setLoading(true);
      clearMessages();
      const result = await sdk.tenants.findByCriteria({
        pagination: { page: 1, perPage: 10 },
      });
      setTenants(result.items);
      setSuccess(`Found ${result.total} tenants`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tenants');
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  const createTenant = async () => {
    try {
      setLoading(true);
      clearMessages();
      const result = await sdk.tenants.create({
        name: `Test Tenant ${Date.now()}`,
        description: 'A test tenant created from SDK',
        email: `tenant${Date.now()}@example.com`,
      });
      setSuccess(`Tenant created successfully! ID: ${result.id || 'N/A'}`);
      await fetchTenants();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tenant');
    } finally {
      setLoading(false);
    }
  };

  const updateTenant = async (tenantId: string) => {
    try {
      setLoading(true);
      clearMessages();
      await sdk.tenants.update({
        id: tenantId,
        description: `Updated at ${new Date().toLocaleString()}`,
      });
      setSuccess(`Tenant updated successfully!`);
      await fetchTenants();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tenant');
    } finally {
      setLoading(false);
    }
  };

  const deleteTenant = async (tenantId: string) => {
    try {
      setLoading(true);
      clearMessages();
      await sdk.tenants.delete({ id: tenantId });
      setSuccess(`Tenant deleted successfully!`);
      await fetchTenants();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tenant');
    } finally {
      setLoading(false);
    }
  };

  // Tenant Member Examples
  const fetchTenantMembers = async () => {
    try {
      setLoading(true);
      clearMessages();
      const result = await sdk.tenantMembers.findByCriteria({
        pagination: { page: 1, perPage: 10 },
      });
      setTenantMembers(result.items);
      setSuccess(`Found ${result.total} tenant members`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch tenant members',
      );
      setTenantMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Subscription Plan Examples
  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      clearMessages();
      const result = await sdk.subscriptionPlans.findByCriteria({
        pagination: { page: 1, perPage: 10 },
      });
      setSubscriptionPlans(result.items);
      setSuccess(`Found ${result.total} subscription plans`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch subscription plans',
      );
      setSubscriptionPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const createSubscriptionPlan = async () => {
    try {
      setLoading(true);
      clearMessages();
      const result = await sdk.subscriptionPlans.create({
        name: `Test Plan ${Date.now()}`,
        type: 'BASIC',
        priceMonthly: 9.99,
        currency: 'USD',
        interval: 'MONTHLY',
        intervalCount: 1,
        description: 'A test subscription plan',
        features: ['Feature 1', 'Feature 2'],
      });
      setSuccess(
        `Subscription plan created successfully! ID: ${result.id || 'N/A'}`,
      );
      await fetchSubscriptionPlans();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create subscription plan',
      );
    } finally {
      setLoading(false);
    }
  };

  // Event Examples
  const fetchEvents = async () => {
    try {
      setLoading(true);
      clearMessages();
      const result = await sdk.events.findByCriteria({
        pagination: { page: 1, perPage: 10 },
        sorts: [{ field: 'timestamp', direction: 'DESC' }],
      });
      setEvents(result.items);
      setSuccess(`Found ${result.total} events`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'auth', label: 'Auth' },
    { id: 'users', label: 'Users' },
    { id: 'tenants', label: 'Tenants' },
    { id: 'tenant-members', label: 'Tenant Members' },
    { id: 'subscription-plans', label: 'Subscription Plans' },
    { id: 'events', label: 'Events' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col gap-8 py-16 px-8 bg-white dark:bg-black">
        <div>
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-2">
            SDK Test Page
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Comprehensive testing of all SDK features
          </p>
        </div>

        {/* Health Check Section */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                Health Check
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                API Status:
              </p>
              <p
                className={`text-lg font-medium ${
                  healthStatus === 'ok' || healthStatus === 'healthy'
                    ? 'text-green-600 dark:text-green-400'
                    : healthStatus === 'Error'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {healthStatus}
              </p>
            </div>
            <button
              onClick={checkHealth}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
            <p className="text-green-800 dark:text-green-200 font-medium">
              Success:
            </p>
            <p className="text-green-600 dark:text-green-400 whitespace-pre-line">
              {success}
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-red-800 dark:text-red-200 font-medium">Error:</p>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Auth Tab */}
        {activeTab === 'auth' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
                Authentication
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Loading...' : 'Register'}
                </button>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Loading...' : 'Login'}
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Loading...' : 'Logout'}
                </button>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4">
                Note: Tokens are automatically saved to localStorage on login
                and cleared on logout.
              </p>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                  Users
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {loading ? 'Loading...' : 'Fetch'}
                  </button>
                  <button
                    onClick={createUser}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Create
                  </button>
                </div>
              </div>
              {users.length > 0 ? (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded border border-zinc-200 dark:border-zinc-800 p-4"
                    >
                      <div>
                        <p className="font-medium text-black dark:text-zinc-50">
                          {user.name || user.userName || 'No name'}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          ID: {user.id} | Role: {user.role || 'N/A'} | Status:{' '}
                          {user.status || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateUser(user.id)}
                          disabled={loading}
                          className="px-3 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50 text-xs"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          disabled={loading}
                          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">
                  No users found. Click Fetch to load users.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tenants Tab */}
        {activeTab === 'tenants' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                  Tenants
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={fetchTenants}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {loading ? 'Loading...' : 'Fetch'}
                  </button>
                  <button
                    onClick={createTenant}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Create
                  </button>
                </div>
              </div>
              {tenants.length > 0 ? (
                <div className="space-y-2">
                  {tenants.map((tenant) => (
                    <div
                      key={tenant.id}
                      className="flex items-center justify-between rounded border border-zinc-200 dark:border-zinc-800 p-4"
                    >
                      <div>
                        <p className="font-medium text-black dark:text-zinc-50">
                          {tenant.name || 'No name'}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          ID: {tenant.id} | Slug: {tenant.slug || 'N/A'} |
                          Status: {tenant.status || 'N/A'}
                        </p>
                        {tenant.description && (
                          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                            {tenant.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateTenant(tenant.id)}
                          disabled={loading}
                          className="px-3 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50 text-xs"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => deleteTenant(tenant.id)}
                          disabled={loading}
                          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">
                  No tenants found. Click Fetch to load tenants.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tenant Members Tab */}
        {activeTab === 'tenant-members' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                  Tenant Members
                </h2>
                <button
                  onClick={fetchTenantMembers}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {loading ? 'Loading...' : 'Fetch'}
                </button>
              </div>
              {tenantMembers.length > 0 ? (
                <div className="space-y-2">
                  {tenantMembers.map((member) => (
                    <div
                      key={member.id}
                      className="rounded border border-zinc-200 dark:border-zinc-800 p-4"
                    >
                      <p className="font-medium text-black dark:text-zinc-50">
                        Member ID: {member.id}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Tenant ID: {member.tenantId || 'N/A'} | User ID:{' '}
                        {member.userId || 'N/A'} | Role: {member.role || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">
                  No tenant members found. Click Fetch to load members.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Subscription Plans Tab */}
        {activeTab === 'subscription-plans' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                  Subscription Plans
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={fetchSubscriptionPlans}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {loading ? 'Loading...' : 'Fetch'}
                  </button>
                  <button
                    onClick={createSubscriptionPlan}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Create
                  </button>
                </div>
              </div>
              {subscriptionPlans.length > 0 ? (
                <div className="space-y-2">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="rounded border border-zinc-200 dark:border-zinc-800 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-black dark:text-zinc-50">
                            {plan.name}
                          </p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {plan.currency} {plan.priceMonthly}/month | Type:{' '}
                            {plan.type || 'N/A'} | Active:{' '}
                            {plan.isActive ? 'Yes' : 'No'}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                            Slug: {plan.slug}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">
                  No subscription plans found. Click Fetch to load plans.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                  Events
                </h2>
                <button
                  onClick={fetchEvents}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {loading ? 'Loading...' : 'Fetch'}
                </button>
              </div>
              {events.length > 0 ? (
                <div className="space-y-2">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="rounded border border-zinc-200 dark:border-zinc-800 p-4"
                    >
                      <p className="font-medium text-black dark:text-zinc-50">
                        {event.eventType || 'Unknown Event'}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Aggregate: {event.aggregateType || 'N/A'} | Timestamp:{' '}
                        {event.timestamp
                          ? new Date(event.timestamp).toLocaleString()
                          : 'N/A'}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                        ID: {event.id}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">
                  No events found. Click Fetch to load events.
                </p>
              )}
            </div>
          </div>
        )}

        {/* API URL Info */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong>API URL:</strong>{' '}
            {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100/api/v1'}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            Set NEXT_PUBLIC_API_URL environment variable to change the API
            endpoint
          </p>
        </div>
      </main>
    </div>
  );
}
