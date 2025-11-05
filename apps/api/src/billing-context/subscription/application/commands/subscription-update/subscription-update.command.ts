import { ISubscriptionUpdateCommandDto } from '@/billing-context/subscription/application/dtos/commands/subscription-update/subscription-update-command.dto';
import { SubscriptionEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-end-date/subscription-end-date.vo';
import { SubscriptionRenewalMethodValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-renewal-method copy/subscription-renewal-method.vo';
import { SubscriptionStartDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-start-date/subscription-start-date.vo';
import { SubscriptionStatusValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-status/subscription-status.vo';
import { SubscriptionStripeCustomerIdValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-stripe-customer-id/subscription-stripe-customer-id.vo';
import { SubscriptionStripeSubscriptionIdValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-stripe-id/subscription-stripe-id.vo';
import { SubscriptionTrialEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-trial-end-date/subscription-trial-end-date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';

export class SubscriptionUpdateCommand {
  readonly id: SubscriptionUuidValueObject;
  readonly tenantId?: TenantUuidValueObject;
  readonly planId?: SubscriptionPlanUuidValueObject;
  readonly startDate?: SubscriptionStartDateValueObject;
  readonly endDate?: SubscriptionEndDateValueObject;
  readonly trialEndDate?: SubscriptionTrialEndDateValueObject;
  readonly status?: SubscriptionStatusValueObject;
  readonly stripeSubscriptionId?: SubscriptionStripeSubscriptionIdValueObject;
  readonly stripeCustomerId?: SubscriptionStripeCustomerIdValueObject;
  readonly renewalMethod?: SubscriptionRenewalMethodValueObject;

  constructor(props: ISubscriptionUpdateCommandDto) {
    this.id = new SubscriptionUuidValueObject(props.id);

    if (props.tenantId !== undefined) {
      this.tenantId = new TenantUuidValueObject(props.tenantId);
    }

    if (props.planId !== undefined) {
      this.planId = new SubscriptionPlanUuidValueObject(props.planId);
    }

    if (props.startDate !== undefined) {
      this.startDate = new SubscriptionStartDateValueObject(props.startDate);
    }

    if (props.endDate !== undefined) {
      this.endDate = new SubscriptionEndDateValueObject(props.endDate);
    }

    if (props.trialEndDate !== undefined) {
      this.trialEndDate = new SubscriptionTrialEndDateValueObject(
        props.trialEndDate,
      );
    }

    if (props.status !== undefined) {
      this.status = new SubscriptionStatusValueObject(props.status);
    }

    if (props.stripeSubscriptionId !== undefined) {
      this.stripeSubscriptionId =
        new SubscriptionStripeSubscriptionIdValueObject(
          props.stripeSubscriptionId,
        );
    }

    if (props.stripeCustomerId !== undefined) {
      this.stripeCustomerId = new SubscriptionStripeCustomerIdValueObject(
        props.stripeCustomerId,
      );
    }

    if (props.renewalMethod !== undefined) {
      this.renewalMethod = new SubscriptionRenewalMethodValueObject(
        props.renewalMethod,
      );
    }
  }
}
