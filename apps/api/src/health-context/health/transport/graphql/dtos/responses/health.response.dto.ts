import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('HealthResponseDto')
export class HealthResponseDto {
  @Field(() => String, {
    nullable: false,
    description: 'The status of the check',
  })
  status: string;

  @Field(() => String, {
    nullable: false,
    description: 'The status of the write database check',
  })
  writeDatabaseStatus: string;
  @Field(() => String, {
    nullable: false,
    description: 'The status of the read database check',
  })
  readDatabaseStatus: string;
}

@ObjectType('PaginatedHealthResultDto')
export class PaginatedHealthResultDto extends BasePaginatedResultDto {
  @Field(() => [HealthResponseDto], {
    description: 'The health in the current page',
  })
  items: HealthResponseDto[];
}
