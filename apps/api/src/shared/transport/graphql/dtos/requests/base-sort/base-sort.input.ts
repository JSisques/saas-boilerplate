import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

@InputType('BaseSortInput')
export class BaseSortInput {
  @Field(() => String, { description: 'The field to sort by' })
  @IsString()
  @IsNotEmpty()
  field: string;

  @Field(() => SortDirection, { description: 'The direction to sort by' })
  @IsEnum(SortDirection)
  @IsNotEmpty()
  direction: SortDirection;
}
