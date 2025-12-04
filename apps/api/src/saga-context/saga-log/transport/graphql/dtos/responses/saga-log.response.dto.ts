import { SagaLogTypeEnum } from '@/prisma/master/client';
import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('SagaLogResponseDto')
export class SagaLogResponseDto {
  @Field(() => String, { description: 'The saga log ID' })
  id: string;

  @Field(() => String, { description: 'The saga instance ID' })
  sagaInstanceId: string;

  @Field(() => String, { description: 'The saga step ID' })
  sagaStepId: string;

  @Field(() => SagaLogTypeEnum, { description: 'The saga log type' })
  type: SagaLogTypeEnum;

  @Field(() => String, { description: 'The saga log message' })
  message: string;

  @Field(() => Date, { description: 'The saga log creation date' })
  createdAt: Date;

  @Field(() => Date, { description: 'The saga log update date' })
  updatedAt: Date;
}

@ObjectType('PaginatedSagaLogResultDto')
export class PaginatedSagaLogResultDto extends BasePaginatedResultDto {
  @Field(() => [SagaLogResponseDto], {
    description: 'The saga log items',
  })
  items: SagaLogResponseDto[];
}
