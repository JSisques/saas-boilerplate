"use client";

import { UserRoleEnum } from "@/user-context/users/domain/enums/user-role/user-role.enum";
import { UserStatusEnum } from "@/user-context/users/domain/enums/user-status/user-status.enum";
import { UserAvatar } from "@/user-context/users/presentation/components/atoms/user-avatar/user-avatar";
import { UserRoleBadge } from "@/user-context/users/presentation/components/atoms/user-role-badge/user-role-badge";
import { UserStatusBadge } from "@/user-context/users/presentation/components/atoms/user-status-badge/user-status-badge";
import type { UserResponse } from "@repo/sdk";
import { formatDate } from "@repo/shared/application/services/format-date.service";
import type { ColumnDef } from "@repo/shared/components/ui/data-table";

export const userTableColumns: ColumnDef<UserResponse>[] = [
  {
    id: "avatar",
    header: "Avatar",
    cell: (user) => <UserAvatar user={user} size="sm" />,
    sortable: false,
  },
  {
    id: "userName",
    header: "Username",
    cell: (user) => (
      <span className="text-muted-foreground">
        {user.userName ? `@${user.userName}` : "-"}
      </span>
    ),
    sortable: true,
    sortField: "username",
  },
  {
    id: "bio",
    header: "Bio",
    accessor: "bio",
    sortable: true,
    sortField: "bio",
  },
  {
    id: "name",
    header: "Name",
    accessor: "name",
    sortable: true,
    sortField: "name",
  },
  {
    id: "lastName",
    header: "Last Name",
    accessor: "lastName",
    sortable: true,
    sortField: "lastName",
  },
  {
    id: "role",
    header: "Role",
    cell: (user) => (
      <UserRoleBadge role={(user.role || "USER") as UserRoleEnum} />
    ),
    sortable: true,
    sortField: "role",
  },
  {
    id: "status",
    header: "Status",
    cell: (user) => (
      <UserStatusBadge status={(user.status || "ACTIVE") as UserStatusEnum} />
    ),
    sortable: true,
    sortField: "status",
  },
  {
    id: "createdAt",
    header: "Created At",
    cell: (user) => formatDate(user.createdAt),
    sortable: true,
    sortField: "createdAt",
  },
  {
    id: "updatedAt",
    header: "Updated At",
    cell: (user) => formatDate(user.updatedAt),
    sortable: true,
    sortField: "updatedAt",
  },
];
