import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType('TenantDatabaseCreateRequestDto')
export class TenantDatabaseCreateRequestDto {
  @Field(() => String, {
    description: 'The id of the tenant.',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @Field(() => String, {
    description: 'The name of the database.',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  databaseName: string;

  @Field(() => String, {
    description: 'The URL of the database.',
    nullable: true,
  })
  @IsString()
  @IsNotEmpty()
  databaseUrl: string;
}
