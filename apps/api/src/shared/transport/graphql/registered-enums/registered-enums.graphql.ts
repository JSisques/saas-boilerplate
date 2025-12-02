import {
  CurrencyEnum,
  PromptStatusEnum,
  RenewalMethodEnum,
  SagaStatusEnum,
  SagaStepStatusEnum,
  StatusEnum,
  SubscriptionPlanIntervalEnum,
  SubscriptionPlanTypeEnum,
  SubscriptionStatusEnum,
  TenantDatabaseStatusEnum,
  TenantMemberRoleEnum,
  TenantStatusEnum,
  UserRoleEnum,
} from '@/prisma/master/client';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { registerEnumType } from '@nestjs/graphql';
const registeredEnums = [
  {
    enum: FilterOperator,
    name: 'FilterOperator',
    description: 'The operator to filter by',
  },
  {
    enum: SortDirection,
    name: 'SortDirection',
    description: 'The direction to sort by',
  },
  {
    enum: UserRoleEnum,
    name: 'UserRoleEnum',
    description: 'The role of the user',
  },
  {
    enum: StatusEnum,
    name: 'StatusEnum',
    description: 'The status of the user',
  },
  {
    enum: TenantMemberRoleEnum,
    name: 'TenantMemberRoleEnum',
    description: 'The role of the tenant member',
  },
  {
    enum: TenantStatusEnum,
    name: 'TenantStatusEnum',
    description: 'The status of the tenant',
  },
  {
    enum: SubscriptionPlanTypeEnum,
    name: 'SubscriptionPlanTypeEnum',
    description: 'The type of the subscription plan',
  },
  {
    enum: SubscriptionPlanIntervalEnum,
    name: 'SubscriptionPlanIntervalEnum',
    description: 'The interval of the subscription plan',
  },
  {
    enum: CurrencyEnum,
    name: 'CurrencyEnum',
    description: 'The currency',
  },
  {
    enum: SubscriptionStatusEnum,
    name: 'SubscriptionStatusEnum',
    description: 'The status of the subscription',
  },
  {
    enum: RenewalMethodEnum,
    name: 'RenewalMethodEnum',
    description: 'The renewal method',
  },
  {
    enum: PromptStatusEnum,
    name: 'PromptStatusEnum',
    description: 'The status of the prompt',
  },
  {
    enum: TenantDatabaseStatusEnum,
    name: 'TenantDatabaseStatusEnum',
    description: 'The status of the tenant database',
  },
  {
    enum: SagaStatusEnum,
    name: 'SagaStatusEnum',
    description: 'The status of the saga',
  },
  {
    enum: SagaStepStatusEnum,
    name: 'SagaStepStatusEnum',
    description: 'The status of the saga step',
  },
];

for (const { enum: enumType, name, description } of registeredEnums) {
  registerEnumType(enumType, { name, description });
}
