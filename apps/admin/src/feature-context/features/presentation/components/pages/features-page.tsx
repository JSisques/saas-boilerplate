'use client';

import { FeatureFiltersEnum } from '@/feature-context/features/presentation/enums/feature-filters.enum';
import { FeaturesTable } from '@/feature-context/features/presentation/components/organisms/features-table/features-table';
import { useFeatureFilterFields } from '@/feature-context/features/presentation/hooks/use-feature-filter-fields/use-feature-filter-fields';
import { useDefaultTenantName } from '@/shared/presentation/hooks/use-default-tenant-name';
import { useRoutes } from '@/shared/presentation/hooks/use-routes';
import { BaseFilter, useFeaturesList } from '@repo/sdk';
import { FilterOperator } from '@repo/shared/domain/enums/filter-operator.enum';
import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
import {
  TableLayout,
  type DynamicFilter,
} from '@repo/shared/presentation/components/organisms/table-layout';
import PageWithSidebarTemplate from '@repo/shared/presentation/components/templates/page-with-sidebar-template';
import { Button } from '@repo/shared/presentation/components/ui/button';
import type { Sort } from '@repo/shared/presentation/components/ui/data-table';
import { useDebouncedFilters } from '@repo/shared/presentation/hooks/use-debounced-filters';
import { useFilterOperators } from '@repo/shared/presentation/hooks/use-filter-operators';
import { dynamicFiltersToApiFiltersMapper } from '@repo/shared/presentation/mappers/convert-filters.mapper';
import { dynamicSortsToApiSortsMapper } from '@repo/shared/presentation/mappers/convert-sorts.mapper';
import { DownloadIcon, PlusIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

const FeaturesPage = () => {
  const tCommon = useTranslations('common');
  const t = useTranslations('featuresPage');

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<DynamicFilter[]>([]);
  const [sorts, setSorts] = useState<Sort[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { defaultTenantName, defaultTenantSubtitle } = useDefaultTenantName();

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
          <Button key="add-feature" onClick={() => {}}>
            <PlusIcon className="size-4" />
            {t('actions.addFeature')}
          </Button>,
          <Button key="export-features" variant="outline">
            <DownloadIcon className="size-4" />
            {t('actions.exportFeatures')}
          </Button>,
          <Button key="import-features" variant="outline">
            <UploadIcon className="size-4" />
            {t('actions.importFeatures')}
          </Button>,
          <Button key="delete-features" variant="destructive">
            <TrashIcon className="size-4" />
            {t('actions.deleteFeatures')}
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
          />
        )}
      </TableLayout>
    </PageWithSidebarTemplate>
  );
};

export default FeaturesPage;
