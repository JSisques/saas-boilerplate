import { SubscriptionViewModelFactory } from '@/billing-context/subscription/domain/factories/subscription-plan-view-model/subscription-view-model.factory';
import { SubscriptionViewModel } from '@/billing-context/subscription/domain/view-models/subscription.view-model';
import { SubscriptionMongoDbDto } from '@/billing-context/subscription/infrastructure/database/mongodb/dtos/subscription-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubscriptionMongoDBMapper {
  private readonly logger = new Logger(SubscriptionMongoDBMapper.name);

  constructor(
    private readonly subscriptionViewModelFactory: SubscriptionViewModelFactory,
  ) {}
  /**
   * Converts a MongoDB document to a subscription view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The subscription view model
   */
  public toViewModel(doc: SubscriptionMongoDbDto): SubscriptionViewModel {
    this.logger.log(
      `Converting MongoDB document to subscription view model with id ${doc.id}`,
    );

    return this.subscriptionViewModelFactory.create(doc);
  }

  /**
   * Converts a subscription view model to a MongoDB document
   *
   * @param subscriptionViewModel - The subscription view model to convert
   * @returns The MongoDB document
   */
  public toMongoData(
    subscriptionViewModel: SubscriptionViewModel,
  ): SubscriptionMongoDbDto {
    this.logger.log(
      `Converting subscription view model with id ${subscriptionViewModel.id} to MongoDB document`,
    );

    return {
      id: subscriptionViewModel.id,
      tenantId: subscriptionViewModel.tenantId,
      planId: subscriptionViewModel.planId,
      startDate: subscriptionViewModel.startDate,
      endDate: subscriptionViewModel.endDate,
      trialEndDate: subscriptionViewModel.trialEndDate,
      status: subscriptionViewModel.status,
      stripeSubscriptionId: subscriptionViewModel.stripeSubscriptionId,
      stripeCustomerId: subscriptionViewModel.stripeCustomerId,
      renewalMethod: subscriptionViewModel.renewalMethod,
      createdAt: subscriptionViewModel.createdAt,
      updatedAt: subscriptionViewModel.updatedAt,
    };
  }
}
