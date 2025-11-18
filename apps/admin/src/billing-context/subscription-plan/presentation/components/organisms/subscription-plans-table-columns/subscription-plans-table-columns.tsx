"use client";

import { SubscriptionPlanTypeEnum } from "@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum";
import { SubscriptionPlanTypeBadge } from "@/billing-context/subscription-plan/presentation/components/molecules/subscription-plan-type-badge/subscription-plan-type-badge";
import type { SubscriptionPlanResponse } from "@repo/sdk";
import type { ColumnDef } from "@repo/shared/presentation/components/ui/data-table";

export const subscriptionPlansTableColumns: ColumnDef<SubscriptionPlanResponse>[] =
  [
    {
      id: "id",
      header: "ID",
      accessor: "id",
      sortable: true,
      sortField: "id",
    },
    {
      id: "name",
      header: "Name",
      accessor: "name",
      sortable: true,
      sortField: "name",
    },
    {
      id: "slug",
      header: "Slug",
      accessor: "slug",
      sortable: true,
      sortField: "slug",
    },
    {
      id: "type",
      header: "Type",
      cell: (subscriptionPlan) => (
        <SubscriptionPlanTypeBadge
          type={subscriptionPlan.type as SubscriptionPlanTypeEnum}
        />
      ),
      accessor: "type",
      sortable: true,
      sortField: "type",
    },
    {
      id: "description",
      header: "Description",
      accessor: "description",
      sortable: true,
      sortField: "description",
    },
    {
      id: "priceMonthly",
      header: "Price Monthly",
      accessor: "priceMonthly",
      sortable: true,
      sortField: "priceMonthly",
    },
    {
      id: "priceYearly",
      header: "Price Yearly",
      accessor: "priceYearly",
      sortable: true,
      sortField: "priceYearly",
    },
    {
      id: "currency",
      header: "Currency",
      accessor: "currency",
      sortable: true,
      sortField: "currency",
    },
    {
      id: "interval",
      header: "Interval",
      accessor: "interval",
      sortable: true,
      sortField: "interval",
    },
    {
      id: "intervalCount",
      header: "Interval Count",
      accessor: "intervalCount",
      sortable: true,
      sortField: "intervalCount",
    },
    {
      id: "trialPeriodDays",
      header: "Trial Period Days",
      accessor: "trialPeriodDays",
      sortable: true,
      sortField: "trialPeriodDays",
    },
    {
      id: "isActive",
      header: "Is Active",
      accessor: "isActive",
      sortable: true,
      sortField: "isActive",
    },
    {
      id: "features",
      header: "Features",
      accessor: "features",
      sortable: true,
      sortField: "features",
    },
    {
      id: "limits",
      header: "Limits",
      accessor: "limits",
      sortable: true,
      sortField: "limits",
    },
    {
      id: "stripePriceId",
      header: "Stripe Price ID",
      accessor: "stripePriceId",
      sortable: true,
      sortField: "stripePriceId",
    },
    {
      id: "createdAt",
      header: "Created At",
      accessor: "createdAt",
      sortable: true,
      sortField: "createdAt",
    },
    {
      id: "updatedAt",
      header: "Updated At",
      accessor: "updatedAt",
      sortable: true,
      sortField: "updatedAt",
    },
  ];
