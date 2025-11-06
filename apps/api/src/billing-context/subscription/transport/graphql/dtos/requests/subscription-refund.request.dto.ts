import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SubscriptionRefundRequestDto')
export class SubscriptionRefundRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the subscription',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
