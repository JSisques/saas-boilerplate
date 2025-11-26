'use client';

import { useUserTableColumns } from '@/user-context/users/presentation/hooks/use-users-table-columns/use-users-table-columns';
import type { UserResponse } from '@repo/sdk';
import {
  DynamicFilter,
  TableLayout,
} from '@repo/shared/presentation/components/organisms/table-layout';
import type { Sort } from '@repo/shared/presentation/components/ui/data-table';
import { DataTable } from '@repo/shared/presentation/components/ui/data-table';
import { useTranslations } from 'next-intl';

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
  onCellEdit?: (user: UserResponse, columnId: string, newValue: string) => void;
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
  onCellEdit,
}: UsersTableProps) {
  const t = useTranslations('usersPage.organisms.usersTable');
  const userTableColumns = useUserTableColumns();
  return (
    <TableLayout
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={t('searchPlaceholder')}
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
        emptyMessage={t('emptyMessage')}
        className={className}
        onCellEdit={onCellEdit}
      />
    </TableLayout>
  );
}
