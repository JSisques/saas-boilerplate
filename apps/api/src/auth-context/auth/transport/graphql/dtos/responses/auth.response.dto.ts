import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('AuthResponseDto')
export class AuthResponseDto {
  @Field(() => String, { description: 'The id of the auth' })
  id: string;

  @Field(() => String, { description: 'The user id of the auth' })
  userId: string;

  @Field(() => String, { nullable: true, description: 'The email of the auth' })
  email?: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'The email verified of the auth',
  })
  emailVerified?: boolean;

  @Field(() => Date, {
    nullable: true,
    description: 'The last login at of the auth',
  })
  lastLoginAt?: Date;

  @Field(() => String, {
    nullable: true,
    description: 'The provider of the auth',
  })
  provider?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The provider id of the auth',
  })
  providerId?: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'The two factor enabled of the auth',
  })
  twoFactorEnabled?: boolean;
}

@ObjectType('PaginatedAuthResultDto')
export class PaginatedAuthResultDto extends BasePaginatedResultDto {
  @Field(() => [AuthResponseDto], {
    description: 'The auths in the current page',
  })
  items: AuthResponseDto[];
}

@ObjectType('LoginResponseDto')
export class LoginResponseDto {
  @Field(() => String, { description: 'The access token' })
  accessToken: string;

  @Field(() => String, { description: 'The refresh token' })
  refreshToken: string;
}
