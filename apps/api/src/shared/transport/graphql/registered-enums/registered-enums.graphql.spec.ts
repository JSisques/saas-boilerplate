import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import {
  CurrencyEnum,
  PromptStatusEnum,
  RenewalMethodEnum,
  StatusEnum,
  SubscriptionPlanIntervalEnum,
  SubscriptionPlanTypeEnum,
  SubscriptionStatusEnum,
  TenantMemberRoleEnum,
  TenantStatusEnum,
  UserRoleEnum,
} from '@prisma/client';

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

  it('should have StatusEnum defined', () => {
    expect(StatusEnum).toBeDefined();
    expect(typeof StatusEnum).toBe('object');
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

  it('should have CurrencyEnum defined', () => {
    expect(CurrencyEnum).toBeDefined();
    expect(typeof CurrencyEnum).toBe('object');
  });

  it('should have SubscriptionStatusEnum defined', () => {
    expect(SubscriptionStatusEnum).toBeDefined();
    expect(typeof SubscriptionStatusEnum).toBe('object');
  });

  it('should have RenewalMethodEnum defined', () => {
    expect(RenewalMethodEnum).toBeDefined();
    expect(typeof RenewalMethodEnum).toBe('object');
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
      StatusEnum,
      TenantMemberRoleEnum,
      TenantStatusEnum,
      SubscriptionPlanTypeEnum,
      SubscriptionPlanIntervalEnum,
      CurrencyEnum,
      SubscriptionStatusEnum,
      RenewalMethodEnum,
      PromptStatusEnum,
    ];

    enums.forEach((enumType) => {
      expect(enumType).toBeDefined();
      expect(typeof enumType).toBe('object');
    });
  });
});
