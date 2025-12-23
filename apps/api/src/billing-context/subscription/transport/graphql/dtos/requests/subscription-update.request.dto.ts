import { SubscriptionRenewalMethodEnum } from '@/billing-context/subscription/domain/enum/subscription-renewal-method.enum';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType('SubscriptionUpdateRequestDto')
export class SubscriptionUpdateRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the subscription',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'The tenant id of the subscription',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  tenantId: string | null;

  @Field(() => String, {
    description: 'The plan id of the subscription',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  planId: string | null;

  @Field(() => Date, {
    description: 'The start date of the subscription',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  startDate: Date;

  @Field(() => Date, {
    description: 'The end date of the subscription',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  endDate: Date;

  @Field(() => Date, {
    description: 'The trial end date of the subscription',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  trialEndDate: Date | null;

  @Field(() => SubscriptionStatusEnum, {
    description: 'The status of the subscription',
    nullable: true,
  })
  @IsEnum(SubscriptionStatusEnum)
  @IsOptional()
  status: SubscriptionStatusEnum;

  @Field(() => String, {
    description: 'The stripe subscription id of the subscription',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  stripeSubscriptionId: string | null;

  @Field(() => String, {
    description: 'The stripe customer id of the subscription',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  stripeCustomerId: string | null;

  @Field(() => SubscriptionRenewalMethodEnum, {
    description: 'The renewal method of the subscription',
    nullable: true,
  })
  @IsEnum(SubscriptionRenewalMethodEnum)
  @IsOptional()
  renewalMethod: SubscriptionRenewalMethodEnum;
}
