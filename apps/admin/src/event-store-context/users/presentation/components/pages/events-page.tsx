'use client';

import { EventFiltersEnum } from '@/event-store-context/users/domain/enums/event-filters/event-filters.enum';
import { EventsTable } from '@/event-store-context/users/presentation/components/organisms/events-table/events-table';
import { useEventFilterFields } from '@/event-store-context/users/presentation/hooks/use-event-filter-fields';
import { useDefaultTenantName } from '@/shared/presentation/hooks/use-default-tenant-name';
import { useRoutes } from '@/shared/presentation/hooks/use-routes';
import { BaseFilter, useEventsList } from '@repo/sdk';
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
import { RepeatIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

const UsersPage = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<DynamicFilter[]>([]);
  const [sorts, setSorts] = useState<Sort[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { defaultTenantName, defaultTenantSubtitle } = useDefaultTenantName();

  const { getSidebarData } = useRoutes();
  const filterFields = useEventFilterFields();

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
        searchField: EventFiltersEnum.EVENT_TYPE,
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

  const eventsList = useEventsList(requestInput, {
    enabled: true,
  });

  if (eventsList.error) {
    return (
      <div className="p-4">
        <div className="text-destructive">
          Error: {eventsList.error.message}
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
        title="Events"
        description="Manage and view all events in the system"
        actions={[
          <Button key="replay-events" onClick={() => {}}>
            <RepeatIcon className="size-4" />
            Replay Events
          </Button>,
        ]}
      />

      {/* Table Layout with Search, Filters, and Pagination */}
      <TableLayout
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search events by type..."
        filterFields={filterFields}
        filterOperators={filterOperators}
        filters={filters}
        onFiltersChange={setFilters}
        page={page}
        totalPages={eventsList.data?.totalPages || 0}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        {eventsList.loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <EventsTable
            events={eventsList.data?.items || []}
            sorts={sorts}
            onSortChange={setSorts}
            onCellEdit={() => {}}
          />
        )}
      </TableLayout>
    </PageWithSidebarTemplate>
  );
};

export default UsersPage;
