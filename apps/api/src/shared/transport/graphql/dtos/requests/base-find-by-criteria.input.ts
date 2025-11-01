import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { BaseFilterInput } from './base-filter.input';
import { BasePaginationInput } from './base-pagination.input';
import { BaseSortInput } from './base-sort.input';

@InputType('BaseFindByCriteriaInput')
export class BaseFindByCriteriaInput {
  @Field(() => [BaseFilterInput], {
    nullable: true,
    description: 'The filters to find by',
    defaultValue: [],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  filters?: BaseFilterInput[];

  @Field(() => [BaseSortInput], {
    nullable: true,
    description: 'The sorts to find by',
    defaultValue: [],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  sorts?: BaseSortInput[];

  @Field(() => BasePaginationInput, {
    nullable: true,
    description: 'The pagination to find by',
    defaultValue: { page: 1, perPage: 10 },
  })
  @IsOptional()
  @ValidateNested()
  pagination?: BasePaginationInput;
}
