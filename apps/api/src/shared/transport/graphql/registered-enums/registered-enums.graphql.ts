import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import { SubscriptionRenewalMethodEnum } from '@/billing-context/subscription/domain/enum/subscription-renewal-method.enum';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { registerEnumType } from '@nestjs/graphql';

// TODO: Move this, each module should register its own enums
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
    enum: UserStatusEnum,
    name: 'UserStatusEnum',
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
    enum: SubscriptionPlanCurrencyEnum,
    name: 'CurrencyEnum',
    description: 'The currency',
  },
  {
    enum: SubscriptionStatusEnum,
    name: 'SubscriptionStatusEnum',
    description: 'The status of the subscription',
  },
  {
    enum: SubscriptionRenewalMethodEnum,
    name: 'SubscriptionRenewalMethodEnum',
    description: 'The renewal method',
  },
  {
    enum: PromptStatusEnum,
    name: 'PromptStatusEnum',
    description: 'The status of the prompt',
  },
  {
    enum: SagaInstanceStatusEnum,
    name: 'SagaInstanceStatusEnum',
    description: 'The status of the saga',
  },
  {
    enum: SagaStepStatusEnum,
    name: 'SagaStepStatusEnum',
    description: 'The status of the saga step',
  },
  {
    enum: SagaLogTypeEnum,
    name: 'SagaLogTypeEnum',
    description: 'The type of the saga log',
  },
  {
    enum: FeatureStatusEnum,
    name: 'FeatureStatusEnum',
    description: 'The status of the feature',
  },
];

for (const { enum: enumType, name, description } of registeredEnums) {
  registerEnumType(enumType, { name, description });
}
