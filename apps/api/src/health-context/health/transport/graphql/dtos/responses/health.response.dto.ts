import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('HealthResponseDto')
export class HealthResponseDto {
  @Field(() => String, {
    nullable: false,
    description: 'The status of the check',
  })
  status: string;
}

@ObjectType('PaginatedHealthResultDto')
export class PaginatedHealthResultDto extends BasePaginatedResultDto {
  @Field(() => [HealthResponseDto], {
    description: 'The health in the current page',
  })
  items: HealthResponseDto[];
}
