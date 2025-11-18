import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class BasePaginatedResultDto {
  @Field(() => Int, { description: 'The total number of items' })
  total: number;

  @Field(() => Int, { description: 'The page number' })
  page: number;

  @Field(() => Int, { description: 'The number of items per page' })
  perPage: number;

  @Field(() => Int, { description: 'The total number of pages' })
  totalPages: number;
}
