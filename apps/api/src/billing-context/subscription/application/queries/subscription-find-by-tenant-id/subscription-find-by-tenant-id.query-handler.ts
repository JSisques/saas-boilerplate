import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';
import {
  SUBSCRIPTION_WRITE_REPOSITORY_TOKEN,
  SubscriptionWriteRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSubscriptionByTenantIdQuery } from './subscription-find-by-tenant-id.query';

@QueryHandler(FindSubscriptionByTenantIdQuery)
export class FindSubscriptionByTenantIdQueryHandler
  implements IQueryHandler<FindSubscriptionByTenantIdQuery>
{
  private readonly logger = new Logger(
    FindSubscriptionByTenantIdQueryHandler.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionWriteRepository: SubscriptionWriteRepository,
  ) {}

  /**
   * Executes the FindSubscriptionByTenantIdQuery query.
   *
   * @param query - The FindSubscriptionByTenantIdQuery query to execute.
   * @returns The SubscriptionAggregate if found, null otherwise.
   */
  async execute(
    query: FindSubscriptionByTenantIdQuery,
  ): Promise<SubscriptionAggregate | null> {
    this.logger.log(
      `Executing find subscription by tenant id query: ${query.tenantId.value}`,
    );

    // 01: Find the subscription by tenant id
    return await this.subscriptionWriteRepository.findByTenantId(
      query.tenantId.value,
    );
  }
}
