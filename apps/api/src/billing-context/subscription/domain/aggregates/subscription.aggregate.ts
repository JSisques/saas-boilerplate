import { ISubscriptionCreateDto } from '@/billing-context/subscription/domain/dtos/entities/subscription-create/subscription-create.dto';
import { ISubscriptionUpdateDto } from '@/billing-context/subscription/domain/dtos/entities/subscription-update/subscription-update.dto';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import { SubscriptionPrimitives } from '@/billing-context/subscription/domain/primitives/subscription.primitives';
import { SubscriptionEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-end-date/subscription-end-date.vo';
import { SubscriptionRenewalMethodValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-renewal-method copy/subscription-renewal-method.vo';
import { SubscriptionStartDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-start-date/subscription-start-date.vo';
import { SubscriptionStatusValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-status/subscription-status.vo';
import { SubscriptionStripeCustomerIdValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-stripe-customer-id/subscription-stripe-customer-id.vo';
import { SubscriptionStripeSubscriptionIdValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-stripe-id/subscription-stripe-id.vo';
import { SubscriptionTrialEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-trial-end-date/subscription-trial-end-date.vo';
import { SubscriptionActivatedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-activated/subscription-activated.event';
import { SubscriptionCancelledEvent } from '@/shared/domain/events/billing-context/subscription/subscription-cancelled/subscription-cancelled.event';
import { SubscriptionCreatedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-created/subscription-created.event';
import { SubscriptionDeactivatedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-deactivated/subscription-deactivated.event';
import { SubscriptionDeletedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-deleted/subscription-deleted.event';
import { SubscriptionRefundedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-refunded/subscription-refunded.event';
import { SubscriptionUpdatedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-updated/subscription-updated.event';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { AggregateRoot } from '@nestjs/cqrs';

export class SubscriptionAggregate extends AggregateRoot {
  private readonly _id: SubscriptionUuidValueObject;
  private readonly _tenantId: TenantUuidValueObject;
  private _planId: SubscriptionPlanUuidValueObject;
  private _startDate: SubscriptionStartDateValueObject;
  private _endDate: SubscriptionEndDateValueObject;
  private _trialEndDate: SubscriptionTrialEndDateValueObject | null;
  private _status: SubscriptionStatusValueObject;
  private _stripeSubscriptionId: SubscriptionStripeSubscriptionIdValueObject | null;
  private _stripeCustomerId: SubscriptionStripeCustomerIdValueObject | null;
  private _renewalMethod: SubscriptionRenewalMethodValueObject;

  constructor(props: ISubscriptionCreateDto, generateEvent: boolean = true) {
    super();

    this._id = props.id;
    this._tenantId = props.tenantId;
    this._planId = props.planId;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._trialEndDate = props.trialEndDate;
    this._status = props.status;
    this._stripeSubscriptionId = props.stripeSubscriptionId;
    this._stripeCustomerId = props.stripeCustomerId;
    this._renewalMethod = props.renewalMethod;

    if (generateEvent) {
      this.apply(
        new SubscriptionCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SubscriptionAggregate.name,
            eventType: SubscriptionCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Update the subscription.
   *
   * @param props - The properties to update.
   * @param generateEvent - Whether to generate an event.
   */
  public update(
    props: ISubscriptionUpdateDto,
    generateEvent: boolean = true,
  ): void {
    this._planId = props.planId !== undefined ? props.planId : this._planId;
    this._startDate =
      props.startDate !== undefined ? props.startDate : this._startDate;
    this._endDate = props.endDate !== undefined ? props.endDate : this._endDate;
    this._trialEndDate =
      props.trialEndDate !== undefined
        ? props.trialEndDate
        : this._trialEndDate;
    this._status = props.status !== undefined ? props.status : this._status;
    this._stripeSubscriptionId =
      props.stripeSubscriptionId !== undefined
        ? props.stripeSubscriptionId
        : this._stripeSubscriptionId;
    this._stripeCustomerId =
      props.stripeCustomerId !== undefined
        ? props.stripeCustomerId
        : this._stripeCustomerId;
    this._renewalMethod =
      props.renewalMethod !== undefined
        ? props.renewalMethod
        : this._renewalMethod;

    if (generateEvent) {
      this.apply(
        new SubscriptionUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SubscriptionAggregate.name,
            eventType: SubscriptionUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the subscription.
   *
   * @param generateEvent - Whether to generate an event.
   */
  public delete(generateEvent: boolean = true): void {
    if (generateEvent) {
      this.apply(
        new SubscriptionDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SubscriptionAggregate.name,
            eventType: SubscriptionDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Activate the subscription.
   *
   * @param generateEvent - Whether to generate an event.
   */
  public activate(generateEvent: boolean = true): void {
    this._status = new SubscriptionStatusValueObject(
      SubscriptionStatusEnum.ACTIVE,
    );
    if (generateEvent) {
      this.apply(
        new SubscriptionActivatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SubscriptionAggregate.name,
            eventType: SubscriptionActivatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Deactivate the subscription.
   *
   * @param generateEvent - Whether to generate an event.
   */
  public deactivate(generateEvent: boolean = true): void {
    this._status = new SubscriptionStatusValueObject(
      SubscriptionStatusEnum.INACTIVE,
    );
    if (generateEvent) {
      this.apply(
        new SubscriptionDeactivatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SubscriptionAggregate.name,
            eventType: SubscriptionDeactivatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Cancel the subscription.
   *
   * @param generateEvent - Whether to generate an event.
   */
  public cancel(generateEvent: boolean = true): void {
    this._status = new SubscriptionStatusValueObject(
      SubscriptionStatusEnum.CANCELLED,
    );
    if (generateEvent) {
      this.apply(
        new SubscriptionCancelledEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SubscriptionAggregate.name,
            eventType: SubscriptionCancelledEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Refund the subscription.
   *
   * @param generateEvent - Whether to generate an event.
   */
  public refund(generateEvent: boolean = true): void {
    this._status = new SubscriptionStatusValueObject(
      SubscriptionStatusEnum.REFUNDED,
    );
    if (generateEvent) {
      this.apply(
        new SubscriptionRefundedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: SubscriptionAggregate.name,
            eventType: SubscriptionRefundedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Gets the unique identifier of the subscription.
   * @returns {SubscriptionUuidValueObject} The subscription UUID value object.
   */
  public get id(): SubscriptionUuidValueObject {
    return this._id;
  }
  /**
   * Gets the unique identifier of the tenant associated with the subscription.
   * @returns {TenantUuidValueObject} The unique identifier of the tenant.
   */
  public get tenantId(): TenantUuidValueObject {
    return this._tenantId;
  }

  /**
   * Gets the unique identifier of the subscription plan.
   * @returns {SubscriptionPlanUuidValueObject} The unique identifier of the subscription plan.
   */
  public get planId(): SubscriptionPlanUuidValueObject {
    return this._planId;
  }

  /**
   * Gets the start date of the subscription.
   * @returns {SubscriptionStartDateValueObject} The start date of the subscription.
   */
  public get startDate(): SubscriptionStartDateValueObject {
    return this._startDate;
  }

  /**
   * Gets the end date of the subscription.
   * @returns {SubscriptionEndDateValueObject} The end date of the subscription.
   */
  public get endDate(): SubscriptionEndDateValueObject {
    return this._endDate;
  }

  /**
   * Gets the trial end date of the subscription, or null if not applicable.
   * @returns {SubscriptionTrialEndDateValueObject | null} The trial end date of the subscription.
   */
  public get trialEndDate(): SubscriptionTrialEndDateValueObject | null {
    return this._trialEndDate;
  }

  /**
   * Gets the status of the subscription.
   * @returns {SubscriptionStatusValueObject} The status of the subscription.
   */
  public get status(): SubscriptionStatusValueObject {
    return this._status;
  }

  /**
   * Gets the identifier of the subscription in Stripe, or null if not applicable.
   * @returns {SubscriptionStripeSubscriptionIdValueObject | null} The identifier of the subscription in Stripe.
   */
  public get stripeSubscriptionId(): SubscriptionStripeSubscriptionIdValueObject | null {
    return this._stripeSubscriptionId;
  }

  /**
   * Gets the identifier of the customer in Stripe, or null if not applicable.
   * @returns {SubscriptionStripeCustomerIdValueObject | null} The identifier of the customer in Stripe.
   */
  public get stripeCustomerId(): SubscriptionStripeCustomerIdValueObject | null {
    return this._stripeCustomerId;
  }

  /**
   * Gets the renewal method of the subscription.
   * @returns {SubscriptionRenewalMethodValueObject} The renewal method of the subscription.
   */
  public get renewalMethod(): SubscriptionRenewalMethodValueObject {
    return this._renewalMethod;
  }

  /**
   * Converts the subscription aggregate to its primitive representation.
   * @returns {SubscriptionPrimitives} The primitive representation of the subscription.
   */
  public toPrimitives(): SubscriptionPrimitives {
    return {
      id: this._id.value,
      tenantId: this._tenantId.value,
      planId: this._planId.value,
      startDate: this._startDate.value,
      endDate: this._endDate.value,
      trialEndDate: this._trialEndDate ? this._trialEndDate.value : null,
      status: this._status.value,
      stripeSubscriptionId: this._stripeSubscriptionId
        ? this._stripeSubscriptionId.value
        : null,
      stripeCustomerId: this._stripeCustomerId
        ? this._stripeCustomerId.value
        : null,
      renewalMethod: this._renewalMethod.value,
    };
  }
}
