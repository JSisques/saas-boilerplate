import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SubscriptionActivateRequestDto')
export class SubscriptionActivateRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the subscription',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
