import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { RenewalMethodEnum, SubscriptionStatusEnum } from '@prisma/client';

@ObjectType('SubscriptionResponseDto')
export class SubscriptionResponseDto {
  @Field(() => String, {
    nullable: false,
    description: 'The id of the subscription',
  })
  id: string;

  @Field(() => String, {
    nullable: false,
    description: 'The name of the subscription',
  })
  tenantId: string;

  @Field(() => String, {
    nullable: false,
    description: 'The plan id of the subscription',
  })
  planId: string;

  @Field(() => String, {
    nullable: false,
    description: 'The start date of the subscription',
  })
  startDate: Date;

  @Field(() => Date, {
    nullable: false,
    description: 'The end date of the subscription',
  })
  endDate: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'The trial end date of the subscription',
  })
  trialEndDate: Date | null;

  @Field(() => SubscriptionStatusEnum, {
    nullable: false,
    description: 'The status of the subscription',
  })
  status: SubscriptionStatusEnum;

  @Field(() => String, {
    nullable: true,
    description: 'The stripe subscription id of the subscription',
  })
  stripeSubscriptionId: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'The stripe customer id of the subscription',
  })
  stripeCustomerId: string | null;

  @Field(() => RenewalMethodEnum, {
    nullable: false,
    description: 'The renewal method of the subscription',
  })
  renewalMethod: RenewalMethodEnum;
}

@ObjectType('PaginatedSubscriptionResultDto')
export class PaginatedSubscriptionResultDto extends BasePaginatedResultDto {
  @Field(() => [SubscriptionResponseDto], {
    description: 'The subscriptions in the current page',
  })
  items: SubscriptionResponseDto[];
}
