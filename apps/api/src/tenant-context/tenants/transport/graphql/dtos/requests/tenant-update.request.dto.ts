import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

@InputType('TenantUpdateRequestDto')
export class TenantUpdateRequestDto {
  @Field(() => String, {
    description: 'The unique identifier of the tenant',
    nullable: false,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'The name of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => String, {
    description: 'The description of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => String, {
    description: 'The website url of the tenant',
    nullable: true,
  })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @Field(() => String, {
    description: 'The logo url of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @Field(() => String, {
    description: 'The favicon url of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  faviconUrl?: string;

  @Field(() => String, {
    description: 'The primary color of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @Field(() => String, {
    description: 'The secondary color of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  secondaryColor?: string;

  @Field(() => String, {
    description: 'The status of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @Field(() => String, {
    description: 'The email of the tenant',
    nullable: true,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(() => String, {
    description: 'The phone number of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @Field(() => String, {
    description: 'The phone code of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  phoneCode?: string;

  @Field(() => String, {
    description: 'The address of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @Field(() => String, {
    description: 'The city of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @Field(() => String, {
    description: 'The state of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  state?: string;

  @Field(() => String, {
    description: 'The country of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @Field(() => String, {
    description: 'The postal code of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @Field(() => String, {
    description: 'The country of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  timezone?: string;

  @Field(() => Number, {
    description: 'The locale of the tenant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  locale?: string;

  @Field(() => String, {
    description: 'The max users of the tenant',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  maxUsers?: number;

  @Field(() => Number, {
    description: 'The max storage of the tenant',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  maxStorage?: number;

  @Field(() => Number, {
    description: 'The max API calls of the tenant',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  maxApiCalls?: number;
}
