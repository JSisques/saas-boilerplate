import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('TenantMemberResponseDto')
export class TenantMemberResponseDto {
  @Field(() => String, { description: 'The id of the tenant member' })
  id: string;

  @Field(() => String, {
    nullable: true,
    description: 'The tenant id of the tenant member',
  })
  tenantId?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The user id of the tenant member',
  })
  userId?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The role of the tenant member',
  })
  role?: string;

  @Field(() => Date, {
    nullable: true,
    description: 'The created at of the tenant member',
  })
  createdAt?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'The updated at of the tenant member',
  })
  updatedAt?: Date;
}

@ObjectType('PaginatedTenantMemberResultDto')
export class PaginatedTenantMemberResultDto extends BasePaginatedResultDto {
  @Field(() => [TenantMemberResponseDto], {
    description: 'The tenant members in the current page',
  })
  items: TenantMemberResponseDto[];
}
