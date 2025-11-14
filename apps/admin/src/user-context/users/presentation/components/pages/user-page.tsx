"use client";

import { FilterOperator } from "@/shared/domain/enums/filter-operator.enum";
import { PageHeader } from "@/shared/presentation/components/organisms/page-header/page-header";
import {
  TableLayout,
  type DynamicFilter,
} from "@/shared/presentation/components/organisms/table-layout/table-layout";
import PageTemplate from "@/shared/presentation/components/templates/page-template/page-template";
import { useDebouncedFilters } from "@/shared/presentation/hooks/use-debounced-filters";
import { useFilterOperators } from "@/shared/presentation/hooks/use-filter-operators";
import { dynamicFiltersToApiFiltersMapper } from "@/shared/presentation/mappers/convert-filters.mapper";
import { UserFiltersEnum } from "@/user-context/users/domain/enums/user-filters/user-filters.enum";
import { UsersTable } from "@/user-context/users/presentation/components/organisms/users-table/users-table";
import { useUserFilterFields } from "@/user-context/users/presentation/hooks/use-user-filter-fields";
import { useUsers } from "@/user-context/users/presentation/hooks/use-users";
import { Button } from "@repo/ui/components/ui/button";
import { DownloadIcon, PlusIcon, TrashIcon, UploadIcon } from "lucide-react";
import { useState } from "react";

const UserPage = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<DynamicFilter[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

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

  const { data, isLoading, error } = useUsers({
    pagination: { page, perPage },
    filters: apiFilters,
  });

  if (error) {
    return (
      <div className="p-4">
        <div className="text-destructive">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <PageTemplate>
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
          <UsersTable users={data?.items || []} />
        )}
      </TableLayout>
    </PageTemplate>
  );
};

export default UserPage;
