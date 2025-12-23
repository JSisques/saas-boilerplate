import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType('SubscriptionPlanUpdateRequestDto')
export class SubscriptionPlanUpdateRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the subscription plan',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'The name of the subscription plan',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name: string | null;

  @Field(() => SubscriptionPlanTypeEnum, {
    description: 'The type of the subscription plan',
    nullable: true,
  })
  @IsEnum(SubscriptionPlanTypeEnum)
  @IsOptional()
  type: SubscriptionPlanTypeEnum | null;

  @Field(() => String, {
    description: 'The description of the subscription plan',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description: string | null;

  @Field(() => Number, {
    description: 'The price monthly of the subscription plan',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  priceMonthly: number | null;

  @Field(() => SubscriptionPlanCurrencyEnum, {
    description: 'The currency of the subscription plan',
    nullable: true,
  })
  @IsEnum(SubscriptionPlanCurrencyEnum)
  @IsOptional()
  currency: SubscriptionPlanCurrencyEnum | null;

  @Field(() => SubscriptionPlanIntervalEnum, {
    description: 'The interval of the subscription plan',
    nullable: true,
  })
  @IsEnum(SubscriptionPlanIntervalEnum)
  @IsOptional()
  interval: SubscriptionPlanIntervalEnum | null;

  @Field(() => Number, {
    description: 'The interval count of the subscription plan',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  intervalCount: number | null;

  @Field(() => Number, {
    description: 'The trial period days of the subscription plan',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  trialPeriodDays: number | null;

  @Field(() => [String], {
    description: 'The features of the subscription plan',
    nullable: true,
  })
  @IsArray()
  @IsOptional()
  features: Record<string, any> | null;

  @Field(() => [String], {
    description: 'The limits of the subscription plan',
    nullable: true,
  })
  @IsArray()
  @IsOptional()
  limits: Record<string, any> | null;

  @Field(() => String, {
    description: 'The stripe price id of the subscription plan',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  stripePriceId: string | null;
}
