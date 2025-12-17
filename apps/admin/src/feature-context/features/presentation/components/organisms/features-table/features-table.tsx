'use client';

import { useFeaturesTableColumns } from '@/feature-context/features/presentation/hooks/use-features-table-columns/use-features-table-columns';
import type { FeatureResponse } from '@repo/sdk';
import type { Sort } from '@repo/shared/presentation/components/ui/data-table';
import { DataTable } from '@repo/shared/presentation/components/ui/data-table';
import { useTranslations } from 'next-intl';

interface FeaturesTableProps {
  features: FeatureResponse[];
  onFeatureClick?: (featureId: string) => void;
  className?: string;
  sorts?: Sort[];
  onSortChange?: (sorts: Sort[]) => void;
  onCellEdit?: (
    feature: FeatureResponse,
    columnId: string,
    newValue: string,
  ) => void;
}

export function FeaturesTable({
  features,
  onFeatureClick,
  className,
  sorts,
  onSortChange,
  onCellEdit,
}: FeaturesTableProps) {
  const t = useTranslations('featuresPage.organisms.featuresTable');
  const featureTableColumns = useFeaturesTableColumns();

  return (
    <DataTable
      data={features}
      columns={featureTableColumns}
      getRowId={(feature) => feature.id}
      onRowClick={
        onFeatureClick ? (feature) => onFeatureClick(feature.id) : undefined
      }
      sorts={sorts}
      onSortChange={onSortChange}
      emptyMessage={t('emptyMessage')}
      className={className}
      onCellEdit={onCellEdit}
    />
  );
}
