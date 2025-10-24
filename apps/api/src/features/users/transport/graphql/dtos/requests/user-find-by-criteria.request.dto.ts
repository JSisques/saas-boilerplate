import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

@InputType('UserFilterInput')
export class UserFilterInput {
  @Field(() => String, { description: 'The field to filter by' })
  @IsString()
  @IsNotEmpty()
  field: string;

  @Field(() => FilterOperator, { description: 'The operator to filter by' })
  @IsEnum(FilterOperator)
  @IsNotEmpty()
  operator: FilterOperator;

  @Field(() => String, { description: 'The value to filter by' })
  @IsString()
  @IsNotEmpty()
  value: string;
}

@InputType('UserSortInput')
export class UserSortInput {
  @Field(() => String, { description: 'The field to sort by' })
  @IsString()
  @IsNotEmpty()
  field: string;

  @Field(() => SortDirection, { description: 'The direction to sort by' })
  @IsEnum(SortDirection)
  @IsNotEmpty()
  direction: SortDirection;
}

@InputType('UserPaginationInput')
export class UserPaginationInput {
  @Field(() => Int, { description: 'The page to paginate by' })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @Field(() => Int, {
    description: 'The per page to paginate by',
  })
  @IsNumber()
  @IsNotEmpty()
  perPage: number;
}

@InputType('UserFindByCriteriaRequestDto')
export class UserFindByCriteriaRequestDto {
  @Field(() => [UserFilterInput], {
    nullable: true,
    description: 'The filters to find by',
    defaultValue: [],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  filters?: UserFilterInput[];

  @Field(() => [UserSortInput], {
    nullable: true,
    description: 'The sorts to find by',
    defaultValue: [],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  sorts?: UserSortInput[];

  @Field(() => UserPaginationInput, {
    nullable: true,
    description: 'The pagination to find by',
    defaultValue: { page: 1, perPage: 10 },
  })
  @IsNotEmpty()
  @ValidateNested()
  pagination?: UserPaginationInput;
}
