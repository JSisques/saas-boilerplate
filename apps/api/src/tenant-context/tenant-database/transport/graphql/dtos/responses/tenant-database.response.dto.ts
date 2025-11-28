import { TenantDatabaseStatusEnum } from '@/prisma/master/client';
import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('TenantDatabaseResponseDto')
export class TenantDatabaseResponseDto {
  @Field(() => String, { description: 'The id of the tenant database' })
  id: string;

  @Field(() => String, {
    nullable: true,
    description: 'The tenant id of the tenant database',
  })
  tenantId?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The database name of the tenant database',
  })
  databaseName?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The database URL of the tenant database',
  })
  readDatabaseName?: string;

  @Field(() => TenantDatabaseStatusEnum, {
    nullable: true,
    description: 'The status of the tenant database',
  })
  status?: TenantDatabaseStatusEnum;

  @Field(() => String, {
    nullable: true,
    description: 'The schema version of the tenant database',
  })
  schemaVersion?: string;

  @Field(() => Date, {
    nullable: true,
    description: 'The last migration at of the tenant database',
  })
  lastMigrationAt?: Date;

  @Field(() => String, {
    nullable: true,
    description: 'The error message of the tenant database',
  })
  errorMessage?: string;

  @Field(() => Date, {
    nullable: true,
    description: 'The created at of the tenant database',
  })
  createdAt?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'The updated at of the tenant database',
  })
  updatedAt?: Date;
}

@ObjectType('PaginatedTenantDatabaseResultDto')
export class PaginatedTenantDatabaseResultDto extends BasePaginatedResultDto {
  @Field(() => [TenantDatabaseResponseDto], {
    description: 'The tenant databases in the current page',
  })
  items: TenantDatabaseResponseDto[];
}
