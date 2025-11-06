import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { registerEnumType } from '@nestjs/graphql';
import {
  CurrencyEnum,
  RenewalMethodEnum,
  StatusEnum,
  SubscriptionPlanIntervalEnum,
  SubscriptionPlanTypeEnum,
  SubscriptionStatusEnum,
  TenantMemberRoleEnum,
  TenantStatusEnum,
  UserRoleEnum,
} from '@prisma/client';

registerEnumType(FilterOperator, {
  name: 'FilterOperator',
  description: 'The operator to filter by',
});

registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: 'The direction to sort by',
});

registerEnumType(UserRoleEnum, {
  name: 'UserRoleEnum',
  description: 'The role of the user',
});

registerEnumType(StatusEnum, {
  name: 'StatusEnum',
  description: 'The status of the user',
});

registerEnumType(TenantMemberRoleEnum, {
  name: 'TenantMemberRoleEnum',
  description: 'The role of the tenant member',
});

registerEnumType(TenantStatusEnum, {
  name: 'TenantStatusEnum',
  description: 'The status of the tenant',
});

registerEnumType(SubscriptionPlanTypeEnum, {
  name: 'SubscriptionPlanTypeEnum',
  description: 'The type of the subscription plan',
});

registerEnumType(SubscriptionPlanIntervalEnum, {
  name: 'SubscriptionPlanIntervalEnum',
  description: 'The interval of the subscription plan',
});

registerEnumType(CurrencyEnum, {
  name: 'CurrencyEnum',
  description: 'The currency',
});

registerEnumType(SubscriptionStatusEnum, {
  name: 'SubscriptionStatusEnum',
  description: 'The status of the subscription',
});

registerEnumType(RenewalMethodEnum, {
  name: 'RenewalMethodEnum',
  description: 'The renewal method',
});
