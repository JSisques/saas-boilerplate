"use client";

import {
  DynamicFilter,
  TableLayout,
} from "@/shared/presentation/components/organisms/table-layout/table-layout";
import { userTableColumns } from "@/user-context/users/presentation/components/organisms/users-table-columns/users-table-columns";
import type { UserResponse } from "@repo/sdk";
import type { Sort } from "@repo/shared/components/ui/data-table";
import { DataTable } from "@repo/shared/components/ui/data-table";

interface UsersTableProps {
  users: UserResponse[];
  onUserClick?: (userId: string) => void;
  className?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: DynamicFilter[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  sorts?: Sort[];
  onSortChange?: (sorts: Sort[]) => void;
}

export function UsersTable({
  users,
  onUserClick,
  className,
  searchValue,
  onSearchChange,
  filters,
  page,
  totalPages,
  onPageChange,
  sorts,
  onSortChange,
}: UsersTableProps) {
  return (
    <TableLayout
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search users by name..."
      filters={filters}
      page={page}
      totalPages={totalPages || 0}
      onPageChange={onPageChange}
    >
      <DataTable
        data={users}
        columns={userTableColumns}
        getRowId={(user) => user.id}
        onRowClick={onUserClick ? (user) => onUserClick(user.id) : undefined}
        sorts={sorts}
        onSortChange={onSortChange}
        emptyMessage="No users found"
        className={className}
      />
    </TableLayout>
  );
}
