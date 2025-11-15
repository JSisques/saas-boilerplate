"use client";

import { UserRoleEnum } from "@/user-context/users/domain/enums/user-role/user-role.enum";
import { Badge } from "@repo/shared/components/ui/badge";
import { cn } from "@repo/shared/lib/utils";

interface UserRoleBadgeProps {
  role: UserRoleEnum;
  className?: string;
}

const roleVariants: Record<UserRoleEnum, "default" | "secondary" | "outline"> =
  {
    [UserRoleEnum.ADMIN]: "default",
    [UserRoleEnum.USER]: "secondary",
  };

const roleStyles: Record<UserRoleEnum, string> = {
  [UserRoleEnum.ADMIN]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800",
  [UserRoleEnum.USER]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800",
};

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const roleEnum = role as UserRoleEnum;
  const variant = roleVariants[roleEnum] || "secondary";
  const customStyles = roleStyles[roleEnum] || roleStyles[UserRoleEnum.USER];

  return (
    <Badge variant={variant} className={cn(customStyles, className)}>
      {role}
    </Badge>
  );
}
