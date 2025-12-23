'use client';

import { FeatureStatusBadge } from '@/feature-context/features/presentation/components/atoms/feature-status-badge/feature-status-badge';
import type { FeatureResponse, FeatureStatus } from '@repo/sdk';
import { formatDate } from '@repo/shared/application/services/format-date.service';
import type { ColumnDef } from '@repo/shared/presentation/components/ui/data-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

/**
 * Hook to get feature table columns configuration.
 * Uses useMemo to prevent infinite re-renders by memoizing the columns array.
 *
 * @returns Memoized array of column definitions for the feature table
 */
export const useFeaturesTableColumns = (): ColumnDef<FeatureResponse>[] => {
  const t = useTranslations('featuresPage.organisms.featuresTableColumns');

  return useMemo(
    () => [
      {
        id: 'key',
        header: t('key'),
        accessor: 'key',
        sortable: true,
        sortField: 'key',
      },
      {
        id: 'name',
        header: t('name'),
        accessor: 'name',
        sortable: true,
        sortField: 'name',
        editable: true,
      },
      {
        id: 'description',
        header: t('description'),
        accessor: 'description',
        sortable: true,
        sortField: 'description',
        editable: true,
      },
      {
        id: 'status',
        header: t('status'),
        cell: (feature) => (
          <FeatureStatusBadge
            status={(feature.status || 'ACTIVE') as FeatureStatus}
          />
        ),
        sortable: true,
        sortField: 'status',
        editable: true,
      },
      {
        id: 'createdAt',
        header: t('createdAt'),
        cell: (feature) => formatDate(feature.createdAt),
        sortable: true,
        sortField: 'createdAt',
      },
      {
        id: 'updatedAt',
        header: t('updatedAt'),
        cell: (feature) => formatDate(feature.updatedAt),
        sortable: true,
        sortField: 'updatedAt',
      },
    ],
    [t],
  );
};
