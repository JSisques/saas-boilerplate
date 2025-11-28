import { TenantDatabaseStatusEnum } from '@/prisma/master/client';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType('TenantDatabaseUpdateRequestDto')
export class TenantDatabaseUpdateRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the tenant database',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'The name of the database',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  databaseName?: string;

  @Field(() => String, {
    description: 'The URL of the database',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  databaseUrl?: string;

  @Field(() => TenantDatabaseStatusEnum, {
    description: 'The status of the database',
    nullable: true,
  })
  @IsEnum(TenantDatabaseStatusEnum)
  @IsOptional()
  status?: TenantDatabaseStatusEnum;

  @Field(() => String, {
    description: 'The schema version of the database',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  schemaVersion?: string;

  @Field(() => Date, {
    description: 'The last migration at of the database',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  lastMigrationAt?: Date;

  @Field(() => String, {
    description: 'The error message of the database',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  errorMessage?: string;
}
