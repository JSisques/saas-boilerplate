import { SidebarData } from '@repo/shared/domain/interfaces/sidebar-data.interface';
import { usePathname } from 'next/navigation';

export const useRoutes = () => {
  const pathname = usePathname();

  const routes = {
    // Main routes
    dashboard: '/dashboard',

    // User Management
    users: '/users',
    auth: '/auth',

    // Tenant Management
    tenants: '/tenants',
    tenantMembers: '/tenant-members',

    // Billing & Subscriptions
    subscriptionPlans: '/subscription-plans',
    subscriptions: '/subscriptions',
    payments: '/payments',

    // AI/LLM
    prompts: '/prompts',
    promptTags: '/prompt-tags',

    // System & Monitoring
    events: '/events',
    health: '/health',

    // Test routes (can be removed in production)
    sdkTest: '/sdk-test',
    sdkTestHooks: '/sdk-test-hooks',
  } as const;

  /**
   * Generates sidebar data structure with active state based on current pathname
   */
  const getSidebarData = (): SidebarData => {
    return {
      navMain: [
        {
          title: 'Main',
          url: '#',
          items: [
            {
              title: 'Dashboard',
              url: routes.dashboard,
              isActive: pathname === routes.dashboard,
            },
          ],
        },
        {
          title: 'User Management',
          url: '#',
          items: [
            {
              title: 'Authentication',
              url: routes.auth,
              isActive: pathname === routes.auth,
            },
            {
              title: 'Users',
              url: routes.users,
              isActive: pathname === routes.users,
            },
          ],
        },
        {
          title: 'Tenant Management',
          url: '#',
          items: [
            {
              title: 'Tenants',
              url: routes.tenants,
              isActive: pathname === routes.tenants,
            },
            {
              title: 'Tenant Members',
              url: routes.tenantMembers,
              isActive: pathname === routes.tenantMembers,
            },
          ],
        },
        {
          title: 'Billing & Subscriptions',
          url: '#',
          items: [
            {
              title: 'Subscription Plans',
              url: routes.subscriptionPlans,
              isActive: pathname === routes.subscriptionPlans,
            },
            {
              title: 'Subscriptions',
              url: routes.subscriptions,
              isActive: pathname === routes.subscriptions,
            },
            {
              title: 'Payments',
              url: routes.payments,
              isActive: pathname === routes.payments,
            },
          ],
        },
        {
          title: 'Artificial Intelligence',
          url: '#',
          items: [
            {
              title: 'Prompts',
              url: routes.prompts,
              isActive: pathname === routes.prompts,
            },
            {
              title: 'Prompt Tags',
              url: routes.promptTags,
              isActive: pathname === routes.promptTags,
            },
          ],
        },
        {
          title: 'System & Monitoring',
          url: '#',
          items: [
            {
              title: 'Events',
              url: routes.events,
              isActive: pathname === routes.events,
            },
            {
              title: 'Health',
              url: routes.health,
              isActive: pathname === routes.health,
            },
          ],
        },
      ],
    };
  };

  return {
    routes,
    getSidebarData,
  };
};
