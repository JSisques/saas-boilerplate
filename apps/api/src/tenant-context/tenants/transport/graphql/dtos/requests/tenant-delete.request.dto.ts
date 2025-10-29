import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('TenantDeleteRequestDto')
export class TenantDeleteRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the tenant',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
