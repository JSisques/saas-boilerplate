import { ISubscriptionCreateCommandDto } from '@/billing-context/subscription/application/dtos/commands/subscription-create/subscription-create-command.dto';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
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

export class SubscriptionCreateCommand {
  readonly id: SubscriptionUuidValueObject;
  readonly tenantId: TenantUuidValueObject;
  readonly planId: SubscriptionPlanUuidValueObject;
  readonly startDate: SubscriptionStartDateValueObject;
  readonly endDate: SubscriptionEndDateValueObject;
  readonly trialEndDate: SubscriptionTrialEndDateValueObject | null;
  readonly status: SubscriptionStatusValueObject;
  readonly stripeSubscriptionId: SubscriptionStripeSubscriptionIdValueObject | null;
  readonly stripeCustomerId: SubscriptionStripeCustomerIdValueObject | null;
  readonly renewalMethod: SubscriptionRenewalMethodValueObject;

  constructor(props: ISubscriptionCreateCommandDto) {
    const now = new Date();

    this.id = new SubscriptionUuidValueObject();
    this.tenantId = new TenantUuidValueObject(props.tenantId);
    this.planId = new SubscriptionPlanUuidValueObject(props.planId);
    this.startDate = new SubscriptionStartDateValueObject(props.startDate);
    this.endDate = new SubscriptionEndDateValueObject(props.endDate);
    this.trialEndDate = new SubscriptionTrialEndDateValueObject(
      new Date(now.setDate(now.getDate() + 30)),
    );
    this.status = new SubscriptionStatusValueObject(
      SubscriptionStatusEnum.ACTIVE,
    );
    this.stripeSubscriptionId = props.stripeSubscriptionId
      ? new SubscriptionStripeSubscriptionIdValueObject(
          props.stripeSubscriptionId,
        )
      : null;
    this.stripeCustomerId = props.stripeCustomerId
      ? new SubscriptionStripeCustomerIdValueObject(props.stripeCustomerId)
      : null;
    this.renewalMethod = new SubscriptionRenewalMethodValueObject(
      props.renewalMethod,
    );
  }
}
