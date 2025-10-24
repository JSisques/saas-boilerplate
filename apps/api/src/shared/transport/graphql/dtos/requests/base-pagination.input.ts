import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType('BasePaginationInput')
export class BasePaginationInput {
  @Field(() => Int, { description: 'The page to paginate by' })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @Field(() => Int, { description: 'The per page to paginate by' })
  @IsNumber()
  @IsNotEmpty()
  perPage: number;
}
