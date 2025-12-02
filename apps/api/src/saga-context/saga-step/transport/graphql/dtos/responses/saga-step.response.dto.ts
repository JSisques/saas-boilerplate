import { SagaStepStatusEnum } from '@/prisma/master/client';
import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('SagaStepResponseDto')
export class SagaStepResponseDto {
  @Field(() => String, { description: 'The saga step ID' })
  id: string;

  @Field(() => String, { description: 'The saga instance ID' })
  sagaInstanceId: string;

  @Field(() => String, { description: 'The saga step name' })
  name: string;

  @Field(() => Number, { description: 'The saga step order' })
  order: number;

  @Field(() => SagaStepStatusEnum, { description: 'The saga step status' })
  status: SagaStepStatusEnum;

  @Field(() => Date, {
    description: 'The saga step start date',
    nullable: true,
  })
  startDate: Date | null;

  @Field(() => Date, { description: 'The saga step end date', nullable: true })
  endDate: Date | null;

  @Field(() => String, {
    description: 'The saga step error message',
    nullable: true,
  })
  errorMessage: string | null;

  @Field(() => Number, { description: 'The saga step retry count' })
  retryCount: number;

  @Field(() => Number, { description: 'The saga step max retries' })
  maxRetries: number;

  @Field(() => String, {
    description: 'The saga step payload',
    nullable: true,
  })
  payload: any;

  @Field(() => String, {
    description: 'The saga step result',
    nullable: true,
  })
  result: any;

  @Field(() => Date, { description: 'The saga step creation date' })
  createdAt: Date;

  @Field(() => Date, { description: 'The saga step update date' })
  updatedAt: Date;
}

@ObjectType('PaginatedSagaStepResultDto')
export class PaginatedSagaStepResultDto extends BasePaginatedResultDto {
  @Field(() => [SagaStepResponseDto], {
    description: 'The saga step items',
  })
  items: SagaStepResponseDto[];
}
