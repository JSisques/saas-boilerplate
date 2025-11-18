"use client";

import type { SubscriptionPlanResponse } from "@repo/sdk";
import {
  DynamicFilter,
  TableLayout,
} from "@repo/shared/presentation/components/organisms/table-layout";
import type { Sort } from "@repo/shared/presentation/components/ui/data-table";
import { DataTable } from "@repo/shared/presentation/components/ui/data-table";
import { subscriptionPlansTableColumns } from "../subscription-plans-table-columns/subscription-plans-table-columns";

interface SubscriptionPlansTableProps {
  subscriptionPlans: SubscriptionPlanResponse[];
  onSubscriptionPlanClick?: (subscriptionId: string) => void;
  className?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: DynamicFilter[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  sorts?: Sort[];
  onSortChange?: (sorts: Sort[]) => void;
}

export function SubscriptionPlansTable({
  subscriptionPlans,
  onSubscriptionPlanClick,
  className,
  searchValue,
  onSearchChange,
  filters,
  page,
  totalPages,
  onPageChange,
  sorts,
  onSortChange,
}: SubscriptionPlansTableProps) {
  return (
    <TableLayout
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search subscription plans by name..."
      filters={filters}
      page={page}
      totalPages={totalPages || 0}
      onPageChange={onPageChange}
    >
      <DataTable
        data={subscriptionPlans}
        columns={subscriptionPlansTableColumns}
        getRowId={(subscriptionPlan) => subscriptionPlan.id}
        onRowClick={
          onSubscriptionPlanClick
            ? (subscriptionPlan) => onSubscriptionPlanClick(subscriptionPlan.id)
            : undefined
        }
        sorts={sorts}
        onSortChange={onSortChange}
        emptyMessage="No subscription plans found"
        className={className}
      />
    </TableLayout>
  );
}
