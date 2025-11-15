"use client";

import { useRoutes } from "@/shared/presentation/hooks/use-routes";
import { UserFiltersEnum } from "@/user-context/users/domain/enums/user-filters/user-filters.enum";
import { UsersTable } from "@/user-context/users/presentation/components/organisms/users-table/users-table";
import { useUserFilterFields } from "@/user-context/users/presentation/hooks/use-user-filter-fields";
import { useUsers } from "@/user-context/users/presentation/hooks/use-users";
import { FilterOperator } from "@repo/shared/domain/enums/filter-operator.enum";
import { SortDirection } from "@repo/shared/domain/enums/sort-direction.enum";
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
import { DownloadIcon, PlusIcon, TrashIcon, UploadIcon } from "lucide-react";
import { useState } from "react";

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<DynamicFilter[]>([]);
  const [sorts, setSorts] = useState<Sort[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

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
  const apiFilters = dynamicFiltersToApiFiltersMapper(debouncedFilters, {
    search: debouncedSearch,
    searchField: UserFiltersEnum.NAME,
    searchOperator: FilterOperator.LIKE,
  });

  // Convert sorts to API format
  const apiSorts = sorts.map((sort) => ({
    field: sort.field,
    direction: sort.direction as SortDirection,
  }));

  const { data, isLoading, error } = useUsers({
    pagination: { page, perPage },
    filters: apiFilters,
    sorts: apiSorts.length > 0 ? apiSorts : undefined,
  });

  if (error) {
    return (
      <div className="p-4">
        <div className="text-destructive">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <PageWithSidebarTemplate
      sidebarProps={{
        data: getSidebarData(),
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
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <UsersTable
            users={data?.items || []}
            sorts={sorts}
            onSortChange={setSorts}
          />
        )}
      </TableLayout>
    </PageWithSidebarTemplate>
  );
};

export default UsersPage;
