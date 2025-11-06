import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SubscriptionCancelRequestDto')
export class SubscriptionCancelRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the subscription',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
