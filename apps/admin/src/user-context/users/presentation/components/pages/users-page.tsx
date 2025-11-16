"use client";

import { useDefaultTenantName } from "@/shared/presentation/hooks/use-default-tenant-name";
import { useRoutes } from "@/shared/presentation/hooks/use-routes";
import { UserFiltersEnum } from "@/user-context/users/domain/enums/user-filters/user-filters.enum";
import { UsersTable } from "@/user-context/users/presentation/components/organisms/users-table/users-table";
import { useUserFilterFields } from "@/user-context/users/presentation/hooks/use-user-filter-fields";
import { BaseFilter, useUsersList } from "@repo/sdk";
import { FilterOperator } from "@repo/shared/domain/enums/filter-operator.enum";
import { PageHeader } from "@repo/shared/presentation/components/organisms/page-header";
import {
  TableLayout,
  type DynamicFilter,
} from "@repo/shared/presentation/components/organisms/table-layout";
import PageWithSidebarTemplate from "@repo/shared/presentation/components/templates/page-with-sidebar-template";
import { Button } from "@repo/shared/presentation/components/ui/button";
import type { Sort } from "@repo/shared/presentation/components/ui/data-table";
import { useDebouncedFilters } from "@repo/shared/presentation/hooks/use-debounced-filters";
import { useFilterOperators } from "@repo/shared/presentation/hooks/use-filter-operators";
import { dynamicFiltersToApiFiltersMapper } from "@repo/shared/presentation/mappers/convert-filters.mapper";
import { dynamicSortsToApiSortsMapper } from "@repo/shared/presentation/mappers/convert-sorts.mapper";
import { DownloadIcon, PlusIcon, TrashIcon, UploadIcon } from "lucide-react";
import { useMemo, useState } from "react";

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<DynamicFilter[]>([]);
  const [sorts, setSorts] = useState<Sort[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const { defaultTenantName, defaultTenantSubtitle } = useDefaultTenantName();

  const { getSidebarData } = useRoutes();
  const filterFields = useUserFilterFields();

  // Define operators
  const filterOperators = useFilterOperators();

  // Debounce search and filters to avoid multiple API calls
  const { debouncedSearch, debouncedFilters } = useDebouncedFilters(
    search,
    filters
  );

  // Convert dynamic filters to API format using debounced values
  const apiFilters = useMemo(
    () =>
      dynamicFiltersToApiFiltersMapper(debouncedFilters, {
        search: debouncedSearch,
        searchField: UserFiltersEnum.NAME,
        searchOperator: FilterOperator.LIKE,
      }),
    [debouncedFilters, debouncedSearch]
  );

  const apiSorts = useMemo(() => dynamicSortsToApiSortsMapper(sorts), [sorts]);

  const requestInput = useMemo(
    () => ({
      pagination: { page, perPage },
      filters: apiFilters as BaseFilter[],
      sorts: apiSorts.length > 0 ? apiSorts : undefined,
    }),
    [page, perPage, apiFilters, apiSorts]
  );

  const usersList = useUsersList(requestInput, {
    enabled: true,
  });

  if (usersList.error) {
    return (
      <div className="p-4">
        <div className="text-destructive">Error: {usersList.error.message}</div>
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
        title="Users"
        description="Manage and view all users in the system"
        actions={[
          <Button key="add-user" onClick={() => {}}>
            <PlusIcon className="size-4" />
            Add User
          </Button>,
          <Button key="export-users" variant="outline">
            <DownloadIcon className="size-4" />
            Export Users
          </Button>,
          <Button key="import-users" variant="outline">
            <UploadIcon className="size-4" />
            Import Users
          </Button>,
          <Button key="delete-users" variant="destructive">
            <TrashIcon className="size-4" />
            Delete Users
          </Button>,
        ]}
      />

      {/* Table Layout with Search, Filters, and Pagination */}
      <TableLayout
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users by name..."
        filterFields={filterFields}
        filterOperators={filterOperators}
        filters={filters}
        onFiltersChange={setFilters}
        page={page}
        totalPages={usersList.data?.totalPages || 0}
        onPageChange={setPage}
      >
        {usersList.loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <UsersTable
            users={usersList.data?.items || []}
            sorts={sorts}
            onSortChange={setSorts}
          />
        )}
      </TableLayout>
    </PageWithSidebarTemplate>
  );
};

export default UsersPage;
