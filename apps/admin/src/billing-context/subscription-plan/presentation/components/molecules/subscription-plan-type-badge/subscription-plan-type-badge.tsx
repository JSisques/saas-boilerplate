"use client";

import { SubscriptionPlanTypeEnum } from "@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum";
import { Badge } from "@repo/shared/presentation/components/ui/badge";
import { cn } from "@repo/shared/presentation/lib/utils";

interface SubscriptionPlanTypeBadgeProps {
  type: SubscriptionPlanTypeEnum;
  className?: string;
}

const typeVariants: Record<
  SubscriptionPlanTypeEnum,
  "default" | "secondary" | "outline"
> = {
  [SubscriptionPlanTypeEnum.FREE]: "default",
  [SubscriptionPlanTypeEnum.BASIC]: "secondary",
  [SubscriptionPlanTypeEnum.PRO]: "secondary",
  [SubscriptionPlanTypeEnum.ENTERPRISE]: "secondary",
};

const typeStyles: Record<SubscriptionPlanTypeEnum, string> = {
  [SubscriptionPlanTypeEnum.FREE]:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
  [SubscriptionPlanTypeEnum.BASIC]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800",
  [SubscriptionPlanTypeEnum.PRO]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800",
  [SubscriptionPlanTypeEnum.ENTERPRISE]:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
};

export function SubscriptionPlanTypeBadge({
  type,
  className,
}: SubscriptionPlanTypeBadgeProps) {
  const typeEnum = type as SubscriptionPlanTypeEnum;
  const variant = typeVariants[typeEnum] || "secondary";
  const customStyles =
    typeStyles[typeEnum] || typeStyles[SubscriptionPlanTypeEnum.FREE];

  return (
    <Badge variant={variant} className={cn(customStyles, className)}>
      {type}
    </Badge>
  );
}
