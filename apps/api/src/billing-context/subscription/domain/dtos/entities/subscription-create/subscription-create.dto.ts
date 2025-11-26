import { SubscriptionEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-end-date/subscription-end-date.vo';
import { SubscriptionRenewalMethodValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-renewal-method copy/subscription-renewal-method.vo';
import { SubscriptionStartDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-start-date/subscription-start-date.vo';
import { SubscriptionStatusValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-status/subscription-status.vo';
import { SubscriptionStripeCustomerIdValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-stripe-customer-id/subscription-stripe-customer-id.vo';
import { SubscriptionStripeSubscriptionIdValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-stripe-id/subscription-stripe-id.vo';
import { SubscriptionTrialEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-trial-end-date/subscription-trial-end-date.vo';
import { IBaseAggregateDto } from '@/shared/domain/interfaces/base-aggregate-dto.interface';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';

/**
 * Data Transfer Object for creating a subscription.
 *
 * @interface ISubscriptionCreateDto
 * @property {SubscriptionUuidValueObject} id - The immutable identifier of the subscription.
 * @property {TenantUuidValueObject} tenantId - The immutable identifier of the tenant.
 * @property {SubscriptionPlanUuidValueObject} planId - The immutable identifier of the subscription plan.
 * @property {SubscriptionStartDateValueObject} startDate - The start date of the subscription.
 * @property {SubscriptionEndDateValueObject} endDate - The end date of the subscription.
 * @property {SubscriptionTrialEndDateValueObject | null} trialEndDate - The trial end date of the subscription.
 * @property {SubscriptionStatusValueObject} status - The status of the subscription.
 * @property {SubscriptionStripeSubscriptionIdValueObject | null} stripeSubscriptionId - The stripe subscription id of the subscription.
 * @property {SubscriptionStripeCustomerIdValueObject | null} stripeCustomerId - The stripe customer id of the subscription.
 * @property {SubscriptionRenewalMethodValueObject} renewalMethod - The renewal method of the subscription.
 */
export interface ISubscriptionCreateDto extends IBaseAggregateDto {
  id: SubscriptionUuidValueObject;
  tenantId: TenantUuidValueObject;
  planId: SubscriptionPlanUuidValueObject;
  startDate: SubscriptionStartDateValueObject;
  endDate: SubscriptionEndDateValueObject;
  trialEndDate: SubscriptionTrialEndDateValueObject | null;
  status: SubscriptionStatusValueObject;
  stripeSubscriptionId: SubscriptionStripeSubscriptionIdValueObject | null;
  stripeCustomerId: SubscriptionStripeCustomerIdValueObject | null;
  renewalMethod: SubscriptionRenewalMethodValueObject;
}
