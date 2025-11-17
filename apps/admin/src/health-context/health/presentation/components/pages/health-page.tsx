'use client';

import { HealthStatusPanel } from '@/health-context/health/presentation/components/organisms/health-status-panel/health-status-panel';
import { useDefaultTenantName } from '@/shared/presentation/hooks/use-default-tenant-name';
import { useRoutes } from '@/shared/presentation/hooks/use-routes';
import { useHealth } from '@repo/sdk';
import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
import PageWithSidebarTemplate from '@repo/shared/presentation/components/templates/page-with-sidebar-template';
import { useEffect, useState } from 'react';

const HealthPage = () => {
  const { defaultTenantName, defaultTenantSubtitle } = useDefaultTenantName();
  const { getSidebarData } = useRoutes();
  const [lastChecked, setLastChecked] = useState<Date | undefined>();

  const { check } = useHealth();

  // Fetch health check on mount
  useEffect(() => {
    check.fetch();
  }, []);

  // Update lastChecked when data or error changes
  useEffect(() => {
    if (check.data || check.error) {
      setLastChecked(new Date());
    }
  }, [check.data, check.error]);

  const handleRefresh = () => {
    check.fetch();
  };

  return (
    <PageWithSidebarTemplate
      sidebarProps={{
        data: getSidebarData(),
        defaultTenantName: defaultTenantName,
        defaultTenantSubtitle: defaultTenantSubtitle,
      }}
    >
      <PageHeader
        title="Health Status"
        description="Monitor the health and status of the system"
      />

      <div className="space-y-6">
        <HealthStatusPanel
          status={check.data?.status}
          writeDatabaseStatus={check.data?.writeDatabaseStatus}
          readDatabaseStatus={check.data?.readDatabaseStatus}
          loading={check.loading}
          error={check.error}
          onRefresh={handleRefresh}
          lastChecked={lastChecked}
        />
      </div>
    </PageWithSidebarTemplate>
  );
};

export default HealthPage;
