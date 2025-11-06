import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('SubscriptionFindByTenantIdRequestDto')
export class SubscriptionFindByTenantIdRequestDto {
  @Field(() => String, {
    description: 'The tenant id of the subscription',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
}
