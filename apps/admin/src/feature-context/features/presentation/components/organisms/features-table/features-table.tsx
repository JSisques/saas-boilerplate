'use client';

import { useFeaturesTableColumns } from '@/feature-context/features/presentation/hooks/use-features-table-columns/use-features-table-columns';
import type { FeatureResponse } from '@repo/sdk';
import type { Sort } from '@repo/shared/presentation/components/ui/data-table';
import { DataTable } from '@repo/shared/presentation/components/ui/data-table';
import { useTranslations } from 'next-intl';
import * as React from 'react';

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
  selectedFeatureIds?: Set<string>;
  onSelectionChange?: (selectedFeatureIds: Set<string>) => void;
}

export function FeaturesTable({
  features,
  onFeatureClick,
  className,
  sorts,
  onSortChange,
  onCellEdit,
  selectedFeatureIds,
  onSelectionChange,
}: FeaturesTableProps) {
  const t = useTranslations('featuresPage.organisms.featuresTable');
  const featureTableColumns = useFeaturesTableColumns();

  // Convert Set<string> to Set<string | number> for DataTable
  const selectedRowIds = React.useMemo(() => {
    if (!selectedFeatureIds) return undefined;
    return new Set<string | number>(
      Array.from(selectedFeatureIds).map((id) => id as string | number),
    );
  }, [selectedFeatureIds]);

  const handleSelectionChange = React.useCallback(
    (newSelection: Set<string | number>) => {
      if (onSelectionChange) {
        // Convert back to Set<string>
        const stringSet = new Set(
          Array.from(newSelection).map((id) => String(id)),
        );
        onSelectionChange(stringSet);
      }
    },
    [onSelectionChange],
  );

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
      enableRowSelection={true}
      selectedRowIds={selectedRowIds}
      onSelectionChange={handleSelectionChange}
    />
  );
}
