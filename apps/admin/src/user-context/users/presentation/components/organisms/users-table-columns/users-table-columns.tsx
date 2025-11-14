"use client";

import { formatDate } from "@/shared/application/services/format-date/format-date.service";
import { UserRoleEnum } from "@/user-context/users/domain/enums/user-role/user-role.enum";
import { UserStatusEnum } from "@/user-context/users/domain/enums/user-status/user-status.enum";
import { UserAvatar } from "@/user-context/users/presentation/components/atoms/user-avatar/user-avatar";
import { UserRoleBadge } from "@/user-context/users/presentation/components/atoms/user-role-badge/user-role-badge";
import { UserStatusBadge } from "@/user-context/users/presentation/components/atoms/user-status-badge/user-status-badge";
import type { UserResponse } from "@repo/sdk";
import type { ColumnDef } from "@repo/ui/components/ui/data-table";

export const userTableColumns: ColumnDef<UserResponse>[] = [
  {
    id: "avatar",
    header: "Avatar",
    cell: (user) => <UserAvatar user={user} size="sm" />,
  },
  {
    id: "userName",
    header: "Username",
    cell: (user) => (
      <span className="text-muted-foreground">
        {user.userName ? `@${user.userName}` : "-"}
      </span>
    ),
  },
  {
    id: "bio",
    header: "Bio",
    accessor: "bio",
  },
  {
    id: "name",
    header: "Name",
    accessor: "name",
  },
  {
    id: "lastName",
    header: "Last Name",
    accessor: "lastName",
  },
  {
    id: "role",
    header: "Role",
    cell: (user) => (
      <UserRoleBadge role={(user.role || "USER") as UserRoleEnum} />
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (user) => (
      <UserStatusBadge status={(user.status || "ACTIVE") as UserStatusEnum} />
    ),
  },
  {
    id: "createdAt",
    header: "Created At",
    cell: (user) => formatDate(user.createdAt),
  },
  {
    id: "updatedAt",
    header: "Updated At",
    cell: (user) => formatDate(user.updatedAt),
  },
];
