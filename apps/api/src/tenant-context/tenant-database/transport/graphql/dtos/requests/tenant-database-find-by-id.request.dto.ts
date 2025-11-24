import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('TenantDatabaseFindByIdRequestDto')
export class TenantDatabaseFindByIdRequestDto {
  @Field(() => String, {
    description: 'The id of the tenant database',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
