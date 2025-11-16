import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('SubscriptionPlanResponseDto')
export class SubscriptionPlanResponseDto {
  @Field(() => String, {
    nullable: false,
    description: 'The id of the subscription plan',
  })
  id: string;

  @Field(() => String, {
    nullable: false,
    description: 'The name of the subscription plan',
  })
  name: string;

  @Field(() => String, {
    nullable: false,
    description: 'The slug of the subscription plan',
  })
  slug: string;

  @Field(() => String, {
    nullable: true,
    description: 'The type of the subscription plan',
  })
  type: string;

  @Field(() => String, {
    nullable: true,
    description: 'The description of the subscription plan',
  })
  description: string | null;

  @Field(() => Number, {
    nullable: false,
    description: 'The price monthly of the subscription plan',
  })
  priceMonthly: number;

  @Field(() => Number, {
    nullable: false,
    description: 'The price yearly of the subscription plan',
  })
  priceYearly: number;

  @Field(() => String, {
    nullable: false,
    description: 'The currency of the subscription plan',
  })
  currency: string;

  @Field(() => String, {
    nullable: false,
    description: 'The interval of the subscription plan',
  })
  interval: string;

  @Field(() => Number, {
    nullable: false,
    description: 'The interval count of the subscription plan',
  })
  intervalCount: number;

  @Field(() => Number, {
    nullable: true,
    description: 'The trial period days of the subscription plan',
  })
  trialPeriodDays?: number | null;

  @Field(() => Boolean, {
    nullable: false,
    description: 'The is active of the subscription plan',
  })
  isActive: boolean;

  @Field(() => [String], {
    nullable: true,
    description: 'The features of the subscription plan',
  })
  features: Record<string, any> | null;

  @Field(() => [String], {
    nullable: true,
    description: 'The limits of the subscription plan',
  })
  limits: Record<string, any> | null;

  @Field(() => String, {
    nullable: true,
    description: 'The stripe price id of the subscription plan',
  })
  stripePriceId: string | null;

  @Field(() => Date, {
    nullable: false,
    description: 'The created at of the subscription plan',
  })
  createdAt: Date;

  @Field(() => Date, {
    nullable: false,
    description: 'The updated at of the subscription plan',
  })
  updatedAt: Date;
}

@ObjectType('PaginatedSubscriptionPlanResultDto')
export class PaginatedSubscriptionPlanResultDto extends BasePaginatedResultDto {
  @Field(() => [SubscriptionPlanResponseDto], {
    description: 'The subscription plans in the current page',
  })
  items: SubscriptionPlanResponseDto[];
}
