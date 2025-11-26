import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('TenantDatabaseDeleteRequestDto')
export class TenantDatabaseDeleteRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the tenant database',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
