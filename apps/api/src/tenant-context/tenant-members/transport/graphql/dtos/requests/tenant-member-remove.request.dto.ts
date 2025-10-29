import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('TenantMemberRemoveRequestDto')
export class TenantMemberRemoveRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the tenant member',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
