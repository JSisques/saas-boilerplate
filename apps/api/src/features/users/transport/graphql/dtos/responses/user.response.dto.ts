import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('UserResponseDto')
export class UserResponseDto {
  @Field(() => String, { description: 'The id of the user' })
  id: string;

  @Field(() => String, { nullable: true, description: 'The name of the user' })
  name?: string;

  @Field(() => String, { nullable: true, description: 'The bio of the user' })
  bio?: string;

  @Field(() => String, {
    nullable: true,
    description: 'The avatar of the user',
  })
  avatar?: string;
}

@ObjectType('PaginatedUserResultDto')
export class PaginatedUserResultDto {
  @Field(() => [UserResponseDto])
  items: UserResponseDto[];

  @Field(() => Int, { description: 'The total number of users' })
  total: number;

  @Field(() => Int, { description: 'The page number' })
  page: number;

  @Field(() => Int, { description: 'The number of users per page' })
  perPage: number;

  @Field(() => Int, { description: 'The total number of pages' })
  totalPages: number;
}
