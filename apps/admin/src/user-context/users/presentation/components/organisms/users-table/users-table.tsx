"use client";

import { formatDate } from "@/shared/application/services/format-date/format-date.service";
import {
  DynamicFilter,
  TableLayout,
} from "@/shared/presentation/components/organisms/table-layout/table-layout";
import { UserRoleEnum } from "@/user-context/users/domain/enums/user-role/user-role.enum";
import { UserStatusEnum } from "@/user-context/users/domain/enums/user-status/user-status.enum";
import { UserAvatar } from "@/user-context/users/presentation/components/atoms/user-avatar/user-avatar";
import { UserRoleBadge } from "@/user-context/users/presentation/components/atoms/user-role-badge/user-role-badge";
import { UserStatusBadge } from "@/user-context/users/presentation/components/atoms/user-status-badge/user-status-badge";
import type { UserResponse } from "@repo/sdk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { cn } from "@repo/ui/lib/utils";

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
      <Table className={className}>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                onClick={() => onUserClick?.(user.id)}
                className={cn(onUserClick && "cursor-pointer")}
              >
                <TableCell>
                  <UserAvatar user={user} size="sm" />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.userName ? `@${user.userName}` : "-"}
                </TableCell>
                <TableCell>{user.bio}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>
                  <UserRoleBadge role={(user.role || "USER") as UserRoleEnum} />
                </TableCell>
                <TableCell>
                  <UserStatusBadge
                    status={(user.status || "ACTIVE") as UserStatusEnum}
                  />
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>{formatDate(user.updatedAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableLayout>
  );
}
