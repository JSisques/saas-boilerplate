"use client";

import { UserResponse } from "@repo/sdk";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/shared/components/ui/avatar";
import { cn } from "@repo/shared/lib/utils";

interface UserAvatarProps {
  user: UserResponse;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "size-8",
  md: "size-12",
  lg: "size-16",
};

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const sizeClass = sizeClasses[size];
  const displayName = user.name || user.userName || "User";
  const initials = user.name
    ? user.name.charAt(0).toUpperCase()
    : user.userName
      ? user.userName.charAt(0).toUpperCase()
      : "U";

  return (
    <Avatar className={cn(sizeClass, className)}>
      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={displayName} />}
      <AvatarFallback className="text-xs font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
