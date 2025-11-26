import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SubscriptionPlanFindByIdRequestDto')
export class SubscriptionPlanFindByIdRequestDto {
  @Field(() => String, {
    description: 'The ID of the subscription plan to find',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
