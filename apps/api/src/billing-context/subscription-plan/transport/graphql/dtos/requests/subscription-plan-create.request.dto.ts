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

@InputType('SubscriptionPlanCreateRequestDto')
export class SubscriptionPlanCreateRequestDto {
  @Field(() => String, {
    description: 'The name of the subscription plan',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => SubscriptionPlanTypeEnum, {
    description: 'The type of the subscription plan',
    nullable: false,
  })
  @IsEnum(SubscriptionPlanTypeEnum)
  @IsNotEmpty()
  type: SubscriptionPlanTypeEnum;

  @Field(() => String, {
    description: 'The description of the subscription plan',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description: string | null;

  @Field(() => Number, {
    description: 'The price monthly of the subscription plan',
    nullable: false,
  })
  @IsNumber()
  @IsNotEmpty()
  priceMonthly: number;

  @Field(() => SubscriptionPlanCurrencyEnum, {
    description: 'The currency of the subscription plan',
    nullable: false,
  })
  @IsEnum(SubscriptionPlanCurrencyEnum)
  @IsNotEmpty()
  currency: SubscriptionPlanCurrencyEnum;

  @Field(() => SubscriptionPlanIntervalEnum, {
    description: 'The interval of the subscription plan',
    nullable: false,
  })
  @IsEnum(SubscriptionPlanIntervalEnum)
  @IsNotEmpty()
  interval: SubscriptionPlanIntervalEnum;

  @Field(() => Number, {
    description: 'The interval count of the subscription plan',
    nullable: false,
  })
  @IsNumber()
  @IsNotEmpty()
  intervalCount: number;

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
