'use client';

import { FeatureCreateModal } from '@/feature-context/features/presentation/components/organisms/feature-create-modal/feature-create-modal';
import { FeaturesTable } from '@/feature-context/features/presentation/components/organisms/features-table/features-table';
import { FeatureFiltersEnum } from '@/feature-context/features/presentation/enums/feature-filters.enum';
import { useFeatureFilterFields } from '@/feature-context/features/presentation/hooks/use-feature-filter-fields/use-feature-filter-fields';
import { useFeaturePageStore } from '@/feature-context/features/presentation/stores/feature-page-store';
import { useDefaultTenantName } from '@/shared/presentation/hooks/use-default-tenant-name';
import { useRoutes } from '@/shared/presentation/hooks/use-routes';
import { BaseFilter, useFeatures, useFeaturesList } from '@repo/sdk';
import { FilterOperator } from '@repo/shared/domain/enums/filter-operator.enum';
import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
import {
  TableLayout,
  type DynamicFilter,
} from '@repo/shared/presentation/components/organisms/table-layout';
import PageWithSidebarTemplate from '@repo/shared/presentation/components/templates/page-with-sidebar-template';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/shared/presentation/components/ui/alert-dialog';
import { Button } from '@repo/shared/presentation/components/ui/button';
import type { Sort } from '@repo/shared/presentation/components/ui/data-table';
import { useDebouncedFilters } from '@repo/shared/presentation/hooks/use-debounced-filters';
import { useFilterOperators } from '@repo/shared/presentation/hooks/use-filter-operators';
import { dynamicFiltersToApiFiltersMapper } from '@repo/shared/presentation/mappers/convert-filters.mapper';
import { dynamicSortsToApiSortsMapper } from '@repo/shared/presentation/mappers/convert-sorts.mapper';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

const FeaturesPage = () => {
  const tCommon = useTranslations('common');
  const t = useTranslations('featuresPage');

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<DynamicFilter[]>([]);
  const [sorts, setSorts] = useState<Sort[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(
    new Set(),
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { defaultTenantName, defaultTenantSubtitle } = useDefaultTenantName();
  const { setIsAddModalOpen } = useFeaturePageStore();

  const { getSidebarData } = useRoutes();
  const filterFields = useFeatureFilterFields();

  // Define operators
  const filterOperators = useFilterOperators();

  // Debounce search and filters to avoid multiple API calls
  const { debouncedSearch, debouncedFilters } = useDebouncedFilters(
    search,
    filters,
  );

  // Convert dynamic filters to API format using debounced values
  const apiFilters = useMemo(
    () =>
      dynamicFiltersToApiFiltersMapper(debouncedFilters, {
        search: debouncedSearch,
        searchField: FeatureFiltersEnum.NAME,
        searchOperator: FilterOperator.LIKE,
      }),
    [debouncedFilters, debouncedSearch],
  );

  const apiSorts = useMemo(() => dynamicSortsToApiSortsMapper(sorts), [sorts]);

  const requestInput = useMemo(
    () => ({
      pagination: { page, perPage },
      filters: apiFilters as BaseFilter[],
      sorts: apiSorts.length > 0 ? apiSorts : undefined,
    }),
    [page, perPage, apiFilters, apiSorts],
  );

  const featuresList = useFeaturesList(requestInput, {
    enabled: true,
  });

  const { delete: deleteFeature } = useFeatures();

  const handleDeleteSelected = useCallback(async () => {
    if (selectedFeatureIds.size === 0) return;

    try {
      // Delete all selected features
      await Promise.all(
        Array.from(selectedFeatureIds).map((id) =>
          deleteFeature.mutate({ id }),
        ),
      );

      // Clear selection and refresh the list
      setSelectedFeatureIds(new Set());
      setIsDeleteDialogOpen(false);
      await featuresList.refetch();
    } catch (error) {
      console.error('Error deleting features:', error);
      // Error handling could be improved with toast notifications
    }
  }, [selectedFeatureIds, deleteFeature, featuresList]);

  if (featuresList.error) {
    return (
      <div className="p-4">
        <div className="text-destructive">
          Error: {featuresList.error.message}
        </div>
      </div>
    );
  }

  return (
    <PageWithSidebarTemplate
      sidebarProps={{
        data: getSidebarData(),
        defaultTenantName: defaultTenantName,
        defaultTenantSubtitle: defaultTenantSubtitle,
      }}
    >
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={[
          <Button key="add-feature" onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon className="size-4" />
            {t('actions.addFeature')}
          </Button>,
          <Button
            key="delete-features"
            variant="destructive"
            disabled={selectedFeatureIds.size === 0}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <TrashIcon className="size-4" />
            {t('actions.deleteFeatures')}
            {selectedFeatureIds.size > 0 && ` (${selectedFeatureIds.size})`}
          </Button>,
        ]}
      />

      {/* Table Layout with Search, Filters, and Pagination */}
      <TableLayout
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('organisms.featuresTable.searchPlaceholder')}
        filterFields={filterFields}
        filterOperators={filterOperators}
        filters={filters}
        onFiltersChange={setFilters}
        page={page}
        totalPages={featuresList.data?.totalPages || 0}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        {featuresList.loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-muted-foreground">
              {tCommon('loading')}
            </div>
          </div>
        ) : (
          <FeaturesTable
            features={featuresList.data?.items || []}
            sorts={sorts}
            onSortChange={setSorts}
            onCellEdit={() => {}}
            selectedFeatureIds={selectedFeatureIds}
            onSelectionChange={setSelectedFeatureIds}
          />
        )}
      </TableLayout>
      <FeatureCreateModal onCreated={() => featuresList.refetch()} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('actions.deleteFeaturesConfirmation')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('actions.deleteFeaturesDescription', {
                count: selectedFeatureIds.size,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              disabled={deleteFeature.loading}
            >
              {deleteFeature.loading ? tCommon('loading') : tCommon('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWithSidebarTemplate>
  );
};

export default FeaturesPage;
