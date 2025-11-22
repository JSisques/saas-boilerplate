import { SubscriptionPlanViewModelFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-view-model/subscription-plan-view-model.factory';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { SubscriptionPlanMongoDbDto } from '@/billing-context/subscription-plan/infrastructure/database/mongodb/dtos/subscription-plan-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubscriptionPlanMongoDBMapper {
  private readonly logger = new Logger(SubscriptionPlanMongoDBMapper.name);

  constructor(
    private readonly subscriptionPlanViewModelFactory: SubscriptionPlanViewModelFactory,
  ) {}
  /**
   * Converts a MongoDB document to a subscription plan view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The subscription plan view model
   */
  public toViewModel(
    doc: SubscriptionPlanMongoDbDto,
  ): SubscriptionPlanViewModel {
    this.logger.log(
      `Converting MongoDB document to subscription plan view model with id ${doc.id}`,
    );

    return this.subscriptionPlanViewModelFactory.create({
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      type: doc.type,
      description: doc.description,
      priceMonthly: doc.priceMonthly,
      priceYearly: doc.priceYearly,
      currency: doc.currency,
      interval: doc.interval,
      intervalCount: doc.intervalCount,
      trialPeriodDays: doc.trialPeriodDays,
      isActive: doc.isActive,
      features: doc.features,
      limits: doc.limits,
      stripePriceId: doc.stripePriceId,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    });
  }

  /**
   * Converts a subscription plan view model to a MongoDB document
   *
   * @param subscriptionPlanViewModel - The subscription plan view model to convert
   * @returns The MongoDB document
   */
  public toMongoData(
    subscriptionPlanViewModel: SubscriptionPlanViewModel,
  ): SubscriptionPlanMongoDbDto {
    this.logger.log(
      `Converting subscription plan view model with id ${subscriptionPlanViewModel.id} to MongoDB document`,
    );

    return {
      id: subscriptionPlanViewModel.id,
      name: subscriptionPlanViewModel.name,
      slug: subscriptionPlanViewModel.slug,
      type: subscriptionPlanViewModel.type,
      description: subscriptionPlanViewModel.description,
      priceMonthly: subscriptionPlanViewModel.priceMonthly,
      priceYearly: subscriptionPlanViewModel.priceYearly,
      currency: subscriptionPlanViewModel.currency,
      interval: subscriptionPlanViewModel.interval,
      intervalCount: subscriptionPlanViewModel.intervalCount,
      trialPeriodDays: subscriptionPlanViewModel.trialPeriodDays,
      isActive: subscriptionPlanViewModel.isActive,
      features: subscriptionPlanViewModel.features,
      limits: subscriptionPlanViewModel.limits,
      stripePriceId: subscriptionPlanViewModel.stripePriceId,
      createdAt: subscriptionPlanViewModel.createdAt,
      updatedAt: subscriptionPlanViewModel.updatedAt,
    };
  }
}
