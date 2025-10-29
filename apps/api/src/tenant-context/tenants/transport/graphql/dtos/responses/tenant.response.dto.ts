import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('TenantResponseDto')
export class TenantResponseDto {
  @Field(() => String, { description: 'The id of the tenant' })
  id: string;

  @Field(() => String, {
    nullable: true,
    description: 'The tenant name of the tenant',
  })
  name?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The tenant slug of the tenant',
  })
  slug?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The description of the tenant',
  })
  description?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The website url of the tenant',
  })
  websiteUrl?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The logo url of the tenant',
  })
  logoUrl?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The favicon url of the tenant',
  })
  faviconUrl?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The primary color of the tenant',
  })
  primaryColor?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The secondary color of the tenant',
  })
  secondaryColor?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The status of the tenant',
  })
  status?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The email of the tenant',
  })
  email?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The phone number of the tenant',
  })
  phoneNumber?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The phone code of the tenant',
  })
  phoneCode?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The address of the tenant',
  })
  address?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The city of the tenant',
  })
  city?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The state of the tenant',
  })
  state?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The country of the tenant',
  })
  country?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The postal code of the tenant',
  })
  postalCode?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The timezone of the tenant',
  })
  timezone?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The locale of the tenant',
  })
  locale?: string;

  @Field(() => Number, {
    nullable: true,
    description: 'The max users of the tenant',
  })
  maxUsers?: number;

  @Field(() => Number, {
    nullable: true,
    description: 'The max storage of the tenant',
  })
  maxStorage?: number;

  @Field(() => Number, {
    nullable: true,
    description: 'The max API calls of the tenant',
  })
  maxApiCalls?: number;

  @Field(() => Date, {
    nullable: true,
    description: 'The created at of the tenant',
  })
  createdAt?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'The updated at of the tenant',
  })
  updatedAt?: Date;
}

@ObjectType('PaginatedTenantResultDto')
export class PaginatedTenantResultDto extends BasePaginatedResultDto {
  @Field(() => [TenantResponseDto], {
    description: 'The tenants in the current page',
  })
  items: TenantResponseDto[];
}
