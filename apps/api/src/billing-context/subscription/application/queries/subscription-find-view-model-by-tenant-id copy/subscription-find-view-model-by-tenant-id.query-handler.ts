import {
  SUBSCRIPTION_READ_REPOSITORY_TOKEN,
  SubscriptionReadRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-read/subscription-read.repository';
import { SubscriptionViewModel } from '@/billing-context/subscription/domain/view-models/subscription.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSubscriptionViewModelByTenantIdQuery } from './subscription-find-view-model-by-tenant-id.query';

@QueryHandler(FindSubscriptionViewModelByTenantIdQuery)
export class FindSubscriptionViewModelByTenantIdQueryHandler
  implements IQueryHandler<FindSubscriptionViewModelByTenantIdQuery>
{
  private readonly logger = new Logger(
    FindSubscriptionViewModelByTenantIdQueryHandler.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_READ_REPOSITORY_TOKEN)
    private readonly subscriptionReadRepository: SubscriptionReadRepository,
  ) {}

  /**
   * Executes the FindSubscriptionViewModelByTenantIdQuery query.
   *
   * @param query - The FindSubscriptionViewModelByTenantIdQuery query to execute.
   * @returns The SubscriptionViewModel if found, null otherwise.
   */
  async execute(
    query: FindSubscriptionViewModelByTenantIdQuery,
  ): Promise<SubscriptionViewModel | null> {
    this.logger.log(
      `Executing find subscription view model by tenant id query: ${query.tenantId.value}`,
    );

    // 01: Find the subscription by tenant id
    return await this.subscriptionReadRepository.findByTenantId(
      query.tenantId.value,
    );
  }
}
