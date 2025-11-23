'use client';

import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanTypeBadge } from '@/billing-context/subscription-plan/presentation/components/molecules/subscription-plan-type-badge/subscription-plan-type-badge';
import type { SubscriptionPlanResponse } from '@repo/sdk';
import type { ColumnDef } from '@repo/shared/presentation/components/ui/data-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export const useSubscriptionPlansTableColumns =
  (): ColumnDef<SubscriptionPlanResponse>[] => {
    const t = useTranslations(
      'subscriptionPlansPage.organisms.subscriptionPlansTableColumns',
    );

    return useMemo(
      () => [
        {
          id: 'id',
          header: t('id'),
          accessor: 'id',
          sortable: true,
          sortField: 'id',
        },
        {
          id: 'name',
          header: t('name'),
          accessor: 'name',
          sortable: true,
          sortField: 'name',
        },
        {
          id: 'slug',
          header: t('slug'),
          accessor: 'slug',
          sortable: true,
          sortField: 'slug',
        },
        {
          id: 'type',
          header: t('type'),
          cell: (subscriptionPlan) => (
            <SubscriptionPlanTypeBadge
              type={subscriptionPlan.type as SubscriptionPlanTypeEnum}
            />
          ),
          accessor: 'type',
          sortable: true,
          sortField: 'type',
        },
        {
          id: 'description',
          header: t('description'),
          accessor: 'description',
          sortable: true,
          sortField: 'description',
        },
        {
          id: 'priceMonthly',
          header: t('priceMonthly'),
          accessor: 'priceMonthly',
          sortable: true,
          sortField: 'priceMonthly',
        },
        {
          id: 'priceYearly',
          header: t('priceYearly'),
          accessor: 'priceYearly',
          sortable: true,
          sortField: 'priceYearly',
        },
        {
          id: 'currency',
          header: t('currency'),
          accessor: 'currency',
          sortable: true,
          sortField: 'currency',
        },
        {
          id: 'interval',
          header: t('interval'),
          accessor: 'interval',
          sortable: true,
          sortField: 'interval',
        },
        {
          id: 'intervalCount',
          header: t('intervalCount'),
          accessor: 'intervalCount',
          sortable: true,
          sortField: 'intervalCount',
        },
        {
          id: 'trialPeriodDays',
          header: t('trialPeriodDays'),
          accessor: 'trialPeriodDays',
          sortable: true,
          sortField: 'trialPeriodDays',
        },
        {
          id: 'isActive',
          header: t('isActive'),
          accessor: 'isActive',
          sortable: true,
          sortField: 'isActive',
        },
        {
          id: 'features',
          header: t('features'),
          accessor: 'features',
          sortable: true,
          sortField: 'features',
        },
        {
          id: 'limits',
          header: t('limits'),
          accessor: 'limits',
          sortable: true,
          sortField: 'limits',
        },
        {
          id: 'stripePriceId',
          header: t('stripePriceId'),
          accessor: 'stripePriceId',
          sortable: true,
          sortField: 'stripePriceId',
        },
        {
          id: 'createdAt',
          header: t('createdAt'),
          accessor: 'createdAt',
          sortable: true,
          sortField: 'createdAt',
        },
        {
          id: 'updatedAt',
          header: t('updatedAt'),
          accessor: 'updatedAt',
          sortable: true,
          sortField: 'updatedAt',
        },
      ],
      [t],
    );
  };
