import { RenewalMethodEnum } from '@/prisma/master/client';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType('SubscriptionCreateRequestDto')
export class SubscriptionCreateRequestDto {
  @Field(() => String, {
    description: 'The tenant id of the subscription',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @Field(() => String, {
    description: 'The plan id of the subscription',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @Field(() => String, {
    description: 'The start date of the subscription',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Field(() => Date, {
    description: 'The end date of the subscription',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

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

  @Field(() => RenewalMethodEnum, {
    description: 'The renewal method of the subscription',
    nullable: false,
  })
  @IsEnum(RenewalMethodEnum)
  @IsNotEmpty()
  renewalMethod: RenewalMethodEnum;
}
