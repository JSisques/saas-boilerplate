import { BaseFilterInput } from '@/shared/transport/graphql/dtos/requests/base-filter/base-filter.input';
import { BasePaginationInput } from '@/shared/transport/graphql/dtos/requests/base-pagination/base-pagination.input';
import { BaseSortInput } from '@/shared/transport/graphql/dtos/requests/base-sort/base-sort.input';
import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

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
