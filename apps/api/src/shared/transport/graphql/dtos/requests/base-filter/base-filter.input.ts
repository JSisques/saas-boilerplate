import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

@InputType('BaseFilterInput')
export class BaseFilterInput {
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
