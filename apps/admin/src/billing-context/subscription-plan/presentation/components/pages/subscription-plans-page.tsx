"use client";

import { SubscriptionPlanFiltersEnum } from "@/billing-context/subscription-plan/domain/enum/subscription-plan-filters/user-filters.enum";
import { SubscriptionPlanCreateModal } from "@/billing-context/subscription-plan/presentation/components/organisms/subscription-plan-create-modal/subscription-plan-create-modal";
import { SubscriptionPlansTable } from "@/billing-context/subscription-plan/presentation/components/organisms/subscription-plans-table/subscription-plans-table";
import { useSubscriptionPlanFilterFields } from "@/billing-context/subscription-plan/presentation/hooks/use-subscription-plan-filter-fields";
import { useSubscriptionPlanPageStore } from "@/billing-context/subscription-plan/presentation/stores/subscription-plan-page-store";
import { useDefaultTenantName } from "@/shared/presentation/hooks/use-default-tenant-name";
import { useRoutes } from "@/shared/presentation/hooks/use-routes";
import { BaseFilter, useSubscriptionPlansList } from "@repo/sdk";
import { FilterOperator } from "@repo/shared/domain/enums/filter-operator.enum";
import { PageHeader } from "@repo/shared/presentation/components/organisms/page-header";
import {
  TableLayout,
  type DynamicFilter,
} from "@repo/shared/presentation/components/organisms/table-layout";
import PageWithSidebarTemplate from "@repo/shared/presentation/components/templates/page-with-sidebar-template";
import { Button } from "@repo/shared/presentation/components/ui/button";
import type { Sort } from "@repo/shared/presentation/components/ui/data-table";
import { useDebouncedFilters } from "@repo/shared/presentation/hooks/use-debounced-filters";
import { useFilterOperators } from "@repo/shared/presentation/hooks/use-filter-operators";
import { dynamicFiltersToApiFiltersMapper } from "@repo/shared/presentation/mappers/convert-filters.mapper";
import { dynamicSortsToApiSortsMapper } from "@repo/shared/presentation/mappers/convert-sorts.mapper";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";

const SubscriptionPlansPage = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<DynamicFilter[]>([]);
  const [sorts, setSorts] = useState<Sort[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const { isAddModalOpen, setIsAddModalOpen } = useSubscriptionPlanPageStore();

  const { getSidebarData } = useRoutes();
  const filterFields = useSubscriptionPlanFilterFields();

  const filterOperators = useFilterOperators();

  const { debouncedSearch, debouncedFilters } = useDebouncedFilters(
    search,
    filters
  );

  const apiFilters = useMemo(
    () =>
      dynamicFiltersToApiFiltersMapper(debouncedFilters, {
        search: debouncedSearch,
        searchField: SubscriptionPlanFiltersEnum.NAME,
        searchOperator: FilterOperator.LIKE,
      }),
    [debouncedFilters, debouncedSearch]
  );

  const apiSorts = useMemo(() => dynamicSortsToApiSortsMapper(sorts), [sorts]);

  const requestInput = useMemo(
    () => ({
      pagination: { page, perPage },
      filters: apiFilters as BaseFilter[],
      sorts: apiSorts.length > 0 ? apiSorts : undefined,
    }),
    [page, perPage, apiFilters, apiSorts]
  );

  const subscriptionPlansList = useSubscriptionPlansList(requestInput, {
    enabled: true,
  });

  if (subscriptionPlansList.error) {
    return (
      <div className="p-4">
        <div className="text-destructive">
          Error: {subscriptionPlansList.error.message}
        </div>
      </div>
    );
  }

  return (
    <PageWithSidebarTemplate
      sidebarProps={{
        data: getSidebarData(),
        defaultTenantName: useDefaultTenantName().defaultTenantName,
        defaultTenantSubtitle: useDefaultTenantName().defaultTenantSubtitle,
      }}
    >
      <PageHeader
        title="Subscription Plans"
        description="Manage and view all subscription plans in the system"
        actions={[
          <Button
            key="add-subscription-plan"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusIcon className="size-4" />
            Add Subscription Plan
          </Button>,
          <Button key="delete-subscription-plans" variant="destructive">
            <TrashIcon className="size-4" />
            Delete Subscription Plans
          </Button>,
        ]}
      />

      {/* Table Layout with Search, Filters, and Pagination */}
      <TableLayout
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search subscription plans by name..."
        filterFields={filterFields}
        filterOperators={filterOperators}
        filters={filters}
        onFiltersChange={setFilters}
        page={page}
        totalPages={subscriptionPlansList?.data?.totalPages || 0}
        onPageChange={setPage}
      >
        {subscriptionPlansList.loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <SubscriptionPlansTable
            subscriptionPlans={subscriptionPlansList.data?.items || []}
            onSubscriptionPlanClick={() => {}}
            sorts={sorts}
            onSortChange={setSorts}
          />
        )}
      </TableLayout>
      <SubscriptionPlanCreateModal
        onCreated={() => subscriptionPlansList.refetch()}
      />
    </PageWithSidebarTemplate>
  );
};

export default SubscriptionPlansPage;
