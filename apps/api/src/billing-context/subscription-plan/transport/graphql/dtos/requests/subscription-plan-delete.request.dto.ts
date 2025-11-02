import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('SubscriptionPlanDeleteRequestDto')
export class SubscriptionPlanDeleteRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the subscription plan',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
