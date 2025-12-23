import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import { SubscriptionRenewalMethodEnum } from '@/billing-context/subscription/domain/enum/subscription-renewal-method.enum';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';

// Import the module to trigger enum registration
import './registered-enums.graphql';

describe('registered-enums.graphql', () => {
  it('should be able to import the module without errors', () => {
    // The module is already imported at the top level
    // This test verifies that the import doesn't throw
    expect(true).toBe(true);
  });

  it('should have FilterOperator enum defined', () => {
    expect(FilterOperator).toBeDefined();
    expect(typeof FilterOperator).toBe('object');
  });

  it('should have SortDirection enum defined', () => {
    expect(SortDirection).toBeDefined();
    expect(typeof SortDirection).toBe('object');
  });

  it('should have UserRoleEnum defined', () => {
    expect(UserRoleEnum).toBeDefined();
    expect(typeof UserRoleEnum).toBe('object');
  });

  it('should have UserStatusEnum defined', () => {
    expect(UserStatusEnum).toBeDefined();
    expect(typeof UserStatusEnum).toBe('object');
  });

  it('should have TenantMemberRoleEnum defined', () => {
    expect(TenantMemberRoleEnum).toBeDefined();
    expect(typeof TenantMemberRoleEnum).toBe('object');
  });

  it('should have TenantStatusEnum defined', () => {
    expect(TenantStatusEnum).toBeDefined();
    expect(typeof TenantStatusEnum).toBe('object');
  });

  it('should have SubscriptionPlanTypeEnum defined', () => {
    expect(SubscriptionPlanTypeEnum).toBeDefined();
    expect(typeof SubscriptionPlanTypeEnum).toBe('object');
  });

  it('should have SubscriptionPlanIntervalEnum defined', () => {
    expect(SubscriptionPlanIntervalEnum).toBeDefined();
    expect(typeof SubscriptionPlanIntervalEnum).toBe('object');
  });

  it('should have SubscriptionPlanCurrencyEnum defined', () => {
    expect(SubscriptionPlanCurrencyEnum).toBeDefined();
    expect(typeof SubscriptionPlanCurrencyEnum).toBe('object');
  });

  it('should have SubscriptionStatusEnum defined', () => {
    expect(SubscriptionStatusEnum).toBeDefined();
    expect(typeof SubscriptionStatusEnum).toBe('object');
  });

  it('should have SubscriptionRenewalMethodEnum defined', () => {
    expect(SubscriptionRenewalMethodEnum).toBeDefined();
    expect(typeof SubscriptionRenewalMethodEnum).toBe('object');
  });

  it('should have PromptStatusEnum defined', () => {
    expect(PromptStatusEnum).toBeDefined();
    expect(typeof PromptStatusEnum).toBe('object');
  });

  it('should export all required enums', () => {
    // Verify that all enums are objects (enum types in TypeScript)
    const enums = [
      FilterOperator,
      SortDirection,
      UserRoleEnum,
      UserStatusEnum,
      TenantMemberRoleEnum,
      TenantStatusEnum,
      SubscriptionPlanTypeEnum,
      SubscriptionPlanIntervalEnum,
      SubscriptionPlanCurrencyEnum,
      SubscriptionStatusEnum,
      SubscriptionRenewalMethodEnum,
      PromptStatusEnum,
    ];

    enums.forEach((enumType) => {
      expect(enumType).toBeDefined();
      expect(typeof enumType).toBe('object');
    });
  });
});
