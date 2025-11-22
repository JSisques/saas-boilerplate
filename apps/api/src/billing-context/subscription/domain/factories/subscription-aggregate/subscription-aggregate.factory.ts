import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';
import { ISubscriptionCreateDto } from '@/billing-context/subscription/domain/dtos/entities/subscription-create/subscription-create.dto';
import { SubscriptionPrimitives } from '@/billing-context/subscription/domain/primitives/subscription.primitives';
import { SubscriptionEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-end-date/subscription-end-date.vo';
import { SubscriptionRenewalMethodValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-renewal-method copy/subscription-renewal-method.vo';
import { SubscriptionStartDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-start-date/subscription-start-date.vo';
import { SubscriptionStatusValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-status/subscription-status.vo';
import { SubscriptionStripeCustomerIdValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-stripe-customer-id/subscription-stripe-customer-id.vo';
import { SubscriptionStripeSubscriptionIdValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-stripe-id/subscription-stripe-id.vo';
import { SubscriptionTrialEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-trial-end-date/subscription-trial-end-date.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { Injectable } from '@nestjs/common';

/**
 * Factory class responsible for creating SubscriptionPlanAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate user information.
 */
@Injectable()
export class SubscriptionAggregateFactory
  implements IWriteFactory<SubscriptionAggregate, ISubscriptionCreateDto>
{
  /**
   * Creates a new SubscriptionAggregate entity using the provided properties.
   *
   * @param data   - The subscription create data.
   * @param data.id - The subscription id.
   * @param data.tenantId - The subscription tenant id.
   * @param data.planId - The subscription plan id.
   * @param data.startDate - The subscription start date.
   * @param data.endDate - The subscription end date.
   * @param data.trialEndDate - The subscription trial end date.
   * @param data.status - The subscription status.
   * @param data.stripeSubscriptionId - The subscription stripe subscription id.
   * @param data.stripeCustomerId - The subscription stripe customer id.
   * @param data.renewalMethod - The subscription renewal method.
   * @param data.createdAt - The subscription created at.
   * @param data.updatedAt - The subscription updated at.
   * @param generateEvent - Whether to generate a creation event (default: true).
   * @returns {SubscriptionAggregate} - The created subscription aggregate entity.
   */
  public create(
    data: ISubscriptionCreateDto,
    generateEvent: boolean = true,
  ): SubscriptionAggregate {
    return new SubscriptionAggregate(data, generateEvent);
  }

  /**
   * Creates a new SubscriptionAggregate entity from primitive data.
   *
   * @param data - The subscription primitive data.
   * @param data.id - The subscription id.
   * @param data.tenantId - The subscription tenant id.
   * @param data.planId - The subscription plan id.
   * @param data.startDate - The subscription start date.
   * @param data.endDate - The subscription end date.
   * @param data.trialEndDate - The subscription trial end date.
   * @param data.status - The subscription status.
   * @param data.stripeSubscriptionId - The subscription stripe subscription id.
   * @param data.stripeCustomerId - The subscription stripe customer id.
   * @param data.renewalMethod - The subscription renewal method.
   * @param data.createdAt - The subscription created at.
   * @param data.updatedAt - The subscription updated at.
   * @returns The created subscription aggregate entity.
   */
  public fromPrimitives(data: SubscriptionPrimitives): SubscriptionAggregate {
    return new SubscriptionAggregate({
      id: new SubscriptionUuidValueObject(data.id),
      tenantId: new TenantUuidValueObject(data.tenantId),
      planId: new SubscriptionPlanUuidValueObject(data.planId),
      startDate: new SubscriptionStartDateValueObject(data.startDate),
      endDate: new SubscriptionEndDateValueObject(data.endDate),
      trialEndDate: data.trialEndDate
        ? new SubscriptionTrialEndDateValueObject(data.trialEndDate)
        : null,
      status: new SubscriptionStatusValueObject(data.status),
      stripeSubscriptionId: data.stripeSubscriptionId
        ? new SubscriptionStripeSubscriptionIdValueObject(
            data.stripeSubscriptionId,
          )
        : null,
      stripeCustomerId: data.stripeCustomerId
        ? new SubscriptionStripeCustomerIdValueObject(data.stripeCustomerId)
        : null,
      renewalMethod: new SubscriptionRenewalMethodValueObject(
        data.renewalMethod,
      ),
      createdAt: new DateValueObject(data.createdAt),
      updatedAt: new DateValueObject(data.updatedAt),
    });
  }
}
