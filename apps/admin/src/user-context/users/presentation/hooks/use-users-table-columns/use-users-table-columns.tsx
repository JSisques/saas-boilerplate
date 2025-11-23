'use client';

import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserAvatar } from '@/user-context/users/presentation/components/atoms/user-avatar/user-avatar';
import { UserRoleBadge } from '@/user-context/users/presentation/components/atoms/user-role-badge/user-role-badge';
import { UserStatusBadge } from '@/user-context/users/presentation/components/atoms/user-status-badge/user-status-badge';
import type { UserResponse } from '@repo/sdk';
import { formatDate } from '@repo/shared/application/services/format-date.service';
import type { ColumnDef } from '@repo/shared/presentation/components/ui/data-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

/**
 * Hook to get user table columns configuration.
 * Uses useMemo to prevent infinite re-renders by memoizing the columns array.
 *
 * @returns Memoized array of column definitions for the user table
 */
export const useUserTableColumns = (): ColumnDef<UserResponse>[] => {
  const t = useTranslations('usersPage.organisms.usersTableColumns');

  return useMemo(
    () => [
      {
        id: 'avatar',
        header: t('avatar'),
        cell: (user) => <UserAvatar user={user} size="sm" />,
        sortable: false,
      },
      {
        id: 'userName',
        header: t('userName'),
        cell: (user) => (
          <span className="text-muted-foreground">
            {user.userName ? `@${user.userName}` : '-'}
          </span>
        ),
        sortable: true,
        sortField: 'username',
      },
      {
        id: 'bio',
        header: t('bio'),
        accessor: 'bio',
        sortable: true,
        sortField: 'bio',
        editable: true,
      },
      {
        id: 'name',
        header: t('name'),
        accessor: 'name',
        sortable: true,
        sortField: 'name',
        editable: true,
      },
      {
        id: 'lastName',
        header: t('lastName'),
        accessor: 'lastName',
        sortable: true,
        sortField: 'lastName',
        editable: true,
      },
      {
        id: 'role',
        header: t('role'),
        cell: (user) => (
          <UserRoleBadge role={(user.role || 'USER') as UserRoleEnum} />
        ),
        sortable: true,
        sortField: 'role',
      },
      {
        id: 'status',
        header: t('status'),
        cell: (user) => (
          <UserStatusBadge
            status={(user.status || 'ACTIVE') as UserStatusEnum}
          />
        ),
        sortable: true,
        sortField: 'status',
        editable: true,
      },
      {
        id: 'createdAt',
        header: t('createdAt'),
        cell: (user) => formatDate(user.createdAt),
        sortable: true,
        sortField: 'createdAt',
      },
      {
        id: 'updatedAt',
        header: t('updatedAt'),
        cell: (user) => formatDate(user.updatedAt),
        sortable: true,
        sortField: 'updatedAt',
      },
    ],
    [t],
  );
};
