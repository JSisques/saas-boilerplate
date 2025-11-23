'use client';

import { HealthStatusPanel } from '@/health-context/health/presentation/components/organisms/health-status-panel/health-status-panel';
import { useHealthPageStore } from '@/health-context/health/presentation/stores/health-page-store';
import { useDefaultTenantName } from '@/shared/presentation/hooks/use-default-tenant-name';
import { useRoutes } from '@/shared/presentation/hooks/use-routes';
import { useHealth } from '@repo/sdk';
import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
import PageWithSidebarTemplate from '@repo/shared/presentation/components/templates/page-with-sidebar-template';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

const HealthPage = () => {
  const t = useTranslations('healthPage');

  const { defaultTenantName, defaultTenantSubtitle } = useDefaultTenantName();
  const { getSidebarData } = useRoutes();
  const { lastChecked, setLastChecked } = useHealthPageStore();

  const { check } = useHealth();

  // Fetch health check on mount
  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    check.fetch().then(() => {
      setLastChecked(new Date());
    });
  };

  return (
    <PageWithSidebarTemplate
      sidebarProps={{
        data: getSidebarData(),
        defaultTenantName: defaultTenantName,
        defaultTenantSubtitle: defaultTenantSubtitle,
      }}
    >
      <PageHeader title={t('title')} description={t('description')} />

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
