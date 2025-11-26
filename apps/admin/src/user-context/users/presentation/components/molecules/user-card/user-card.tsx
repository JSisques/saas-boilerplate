"use client";

import { UserRoleEnum } from "@/user-context/users/domain/enums/user-role/user-role.enum";
import { UserStatusEnum } from "@/user-context/users/domain/enums/user-status/user-status.enum";
import { UserViewModel } from "@/user-context/users/domain/view-models/user.view-model";
import { UserAvatar } from "@/user-context/users/presentation/components/atoms/user-avatar/user-avatar";
import { UserRoleBadge } from "@/user-context/users/presentation/components/atoms/user-role-badge/user-role-badge";
import { UserStatusBadge } from "@/user-context/users/presentation/components/atoms/user-status-badge/user-status-badge";
import { UserResponse } from "@repo/sdk";

import {
  Card,
  CardContent,
} from "@repo/shared/presentation/components/ui/card";
import { cn } from "@repo/shared/presentation/lib/utils";

interface UserCardProps {
  user: UserViewModel;
  onClick?: () => void;
  className?: string;
}

export function UserCard({ user, onClick, className }: UserCardProps) {
  const displayName = user.name || user.userName || "Unknown User";
  const fullName = user.lastName
    ? `${user.name || ""} ${user.lastName}`.trim()
    : displayName;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "hover:bg-accent transition-colors",
        onClick && "cursor-pointer",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <UserAvatar user={user as UserResponse} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{fullName}</h3>
            {user.userName && (
              <p className="text-sm text-muted-foreground truncate">
                @{user.userName}
              </p>
            )}
            {user.bio && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {user.bio}
              </p>
            )}
            <div className="flex gap-2 mt-2">
              <UserRoleBadge role={user.role as UserRoleEnum} />
              <UserStatusBadge status={user.status as UserStatusEnum} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
