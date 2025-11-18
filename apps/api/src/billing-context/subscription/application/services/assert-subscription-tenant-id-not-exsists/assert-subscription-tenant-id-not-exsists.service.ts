import { SubscriptionTenantIdAlreadyExistsException } from '@/billing-context/subscription/application/exceptions/subscription-tenant-id-already-exsists/subscription-tenant-id-already-exsists.exception';
import {
  SUBSCRIPTION_WRITE_REPOSITORY_TOKEN,
  SubscriptionWriteRepository,
} from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSubscriptionTenantIdNotExsistsService
  implements IBaseService<string, void>
{
  private readonly logger = new Logger(
    AssertSubscriptionTenantIdNotExsistsService.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionWriteRepository: SubscriptionWriteRepository,
  ) {}

  async execute(tenantId: string): Promise<void> {
    this.logger.log(
      `Asserting subscription tenant id not exists by tenant id: ${tenantId}`,
    );

    // 01: Find the subscription by tenant id
    const existingSubscription =
      await this.subscriptionWriteRepository.findByTenantId(tenantId);

    // 02: If the subscription tenant id exists, throw an error
    if (existingSubscription) {
      this.logger.error(`Subscription tenant id ${tenantId} already exists`);
      throw new SubscriptionTenantIdAlreadyExistsException(tenantId);
    }
  }
}
