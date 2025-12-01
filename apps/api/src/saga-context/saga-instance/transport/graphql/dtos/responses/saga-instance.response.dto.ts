import { SagaStatusEnum } from '@/prisma/master/client';
import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('SagaInstanceResponseDto')
export class SagaInstanceResponseDto {
  @Field(() => String, { description: 'The saga instance ID' })
  id: string;

  @Field(() => String, { description: 'The saga instance name' })
  name: string;

  @Field(() => SagaStatusEnum, { description: 'The saga instance status' })
  status: SagaStatusEnum;

  @Field(() => Date, { description: 'The saga instance start date' })
  startDate: Date;

  @Field(() => Date, { description: 'The saga instance end date' })
  endDate: Date;

  @Field(() => Date, { description: 'The saga instance creation date' })
  createdAt: Date;

  @Field(() => Date, { description: 'The saga instance update date' })
  updatedAt: Date;
}

@ObjectType('PaginatedSagaInstanceResultDto')
export class PaginatedSagaInstanceResultDto extends BasePaginatedResultDto {
  @Field(() => [SagaInstanceResponseDto], {
    description: 'The saga instance items',
  })
  items: SagaInstanceResponseDto[];
}
