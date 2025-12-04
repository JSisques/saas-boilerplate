import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import {
  PaginatedSagaLogResultDto,
  SagaLogResponseDto,
} from '@/saga-context/saga-log/transport/graphql/dtos/responses/saga-log.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaLogGraphQLMapper {
  private readonly logger = new Logger(SagaLogGraphQLMapper.name);

  /**
   * Maps a saga log view model to a saga log response dto.
   *
   * @param sagaLog - The saga log view model to map.
   * @returns The saga log response dto.
   */
  public toResponseDto(sagaLog: SagaLogViewModel): SagaLogResponseDto {
    this.logger.log(
      `Mapping saga log view model to response dto: ${sagaLog.id}`,
    );
    return {
      id: sagaLog.id,
      sagaInstanceId: sagaLog.sagaInstanceId,
      sagaStepId: sagaLog.sagaStepId,
      type: sagaLog.type as any,
      message: sagaLog.message,
      createdAt: sagaLog.createdAt,
      updatedAt: sagaLog.updatedAt,
    };
  }

  /**
   * Maps a paginated saga log result to a paginated saga log response dto.
   *
   * @param paginatedResult - The paginated saga log result to map.
   * @returns The paginated saga log response dto.
   */
  public toPaginatedResponseDto(
    paginatedResult: PaginatedResult<SagaLogViewModel>,
  ): PaginatedSagaLogResultDto {
    this.logger.log(
      `Mapping paginated saga log result to response dto: ${JSON.stringify(paginatedResult)}`,
    );
    return {
      items: paginatedResult.items.map((sagaLog) =>
        this.toResponseDto(sagaLog),
      ),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
