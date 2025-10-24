import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('UserResponseDto')
export class UserResponseDto {
  @Field(() => String, { description: 'The id of the user' })
  id: string;

  @Field(() => String, {
    nullable: true,
    description: 'The user name of the user',
  })
  userName?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The last name of the user',
  })
  lastName?: string;

  @Field(() => String, { nullable: true, description: 'The role of the user' })
  role?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The status of the user',
  })
  status?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The avatar url of the user',
  })
  avatarUrl?: string;

  @Field(() => String, { nullable: true, description: 'The bio of the user' })
  bio?: string;

  @Field(() => String, { nullable: true, description: 'The name of the user' })
  name?: string;
}

@ObjectType('PaginatedUserResultDto')
export class PaginatedUserResultDto extends BasePaginatedResultDto {
  @Field(() => [UserResponseDto], {
    description: 'The users in the current page',
  })
  items: UserResponseDto[];
}
