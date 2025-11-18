"use client";

import { UserStatusEnum } from "@/user-context/users/domain/enums/user-status/user-status.enum";
import { Badge } from "@repo/shared/presentation/components/ui/badge";
import { cn } from "@repo/shared/presentation/lib/utils";

interface UserStatusBadgeProps {
  status: string;
  className?: string;
}

const statusVariants: Record<UserStatusEnum, "default" | "secondary" | "destructive" | "outline"> = {
  [UserStatusEnum.ACTIVE]: "default",
  [UserStatusEnum.INACTIVE]: "secondary",
  [UserStatusEnum.BLOCKED]: "destructive",
};

const statusStyles: Record<UserStatusEnum, string> = {
  [UserStatusEnum.ACTIVE]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
  [UserStatusEnum.INACTIVE]: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700",
  [UserStatusEnum.BLOCKED]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
};

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  const statusEnum = status as UserStatusEnum;
  const variant = statusVariants[statusEnum] || "secondary";
  const customStyles = statusStyles[statusEnum] || statusStyles[UserStatusEnum.INACTIVE];

  return (
    <Badge
      variant={variant}
      className={cn(customStyles, className)}
    >
      {status}
    </Badge>
  );
}

