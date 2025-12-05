import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Tenant Member Response DTO for the Tenants context.
 * This DTO represents a tenant member as seen from the Tenants bounded context.
 * It's independent from the TenantMembers context to maintain bounded context autonomy.
 */
@ObjectType('TenantTenantMemberResponseDto')
export class TenantTenantMemberResponseDto {
  @Field(() => String, {
    description: 'The id of the tenant member',
  })
  id: string;

  @Field(() => String, {
    description: 'The user id of the tenant member',
  })
  userId: string;

  @Field(() => String, {
    description: 'The role of the tenant member',
  })
  role: string;

  @Field(() => Date, {
    nullable: true,
    description: 'The creation timestamp of the tenant member',
  })
  createdAt?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'The last update timestamp of the tenant member',
  })
  updatedAt?: Date;
}

@ObjectType('PaginatedTenantTenantMemberResultDto')
export class PaginatedTenantTenantMemberResultDto extends BasePaginatedResultDto {
  @Field(() => [TenantTenantMemberResponseDto], {
    description: 'The tenant members in the current page',
  })
  items: TenantTenantMemberResponseDto[];
}
