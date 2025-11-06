import { SubscriptionViewModel } from '@/billing-context/subscription/domain/view-models/subscription.view-model';
import {
  PaginatedSubscriptionResultDto,
  SubscriptionResponseDto,
} from '@/billing-context/subscription/transport/graphql/dtos/responses/subscription.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable, Logger } from '@nestjs/common';
import { RenewalMethodEnum, SubscriptionStatusEnum } from '@prisma/client';

@Injectable()
export class SubscriptionGraphQLMapper {
  private readonly logger = new Logger(SubscriptionGraphQLMapper.name);

  toResponseDto(subscription: SubscriptionViewModel): SubscriptionResponseDto {
    this.logger.log(
      `Mapping subscription view model to response dto: ${subscription.id}`,
    );
    return {
      id: subscription.id,
      tenantId: subscription.tenantId,
      planId: subscription.planId,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      trialEndDate: subscription.trialEndDate,
      status: subscription.status as SubscriptionStatusEnum,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      stripeCustomerId: subscription.stripeCustomerId,
      renewalMethod: subscription.renewalMethod as RenewalMethodEnum,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<SubscriptionViewModel>,
  ): PaginatedSubscriptionResultDto {
    return {
      items: paginatedResult.items.map((subscription) =>
        this.toResponseDto(subscription),
      ),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
