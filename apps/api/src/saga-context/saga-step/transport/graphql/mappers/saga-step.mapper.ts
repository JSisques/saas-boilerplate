import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import {
  PaginatedSagaStepResultDto,
  SagaStepResponseDto,
} from '@/saga-context/saga-step/transport/graphql/dtos/responses/saga-step.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaStepGraphQLMapper {
  private readonly logger = new Logger(SagaStepGraphQLMapper.name);

  /**
   * Maps a saga step view model to a saga step response dto.
   *
   * @param sagaStep - The saga step view model to map.
   * @returns The saga step response dto.
   */
  public toResponseDto(sagaStep: SagaStepViewModel): SagaStepResponseDto {
    this.logger.log(
      `Mapping saga step view model to response dto: ${sagaStep.id}`,
    );
    return {
      id: sagaStep.id,
      sagaInstanceId: sagaStep.sagaInstanceId,
      name: sagaStep.name,
      order: sagaStep.order,
      status: sagaStep.status,
      startDate: sagaStep.startDate,
      endDate: sagaStep.endDate,
      errorMessage: sagaStep.errorMessage,
      retryCount: sagaStep.retryCount,
      maxRetries: sagaStep.maxRetries,
      payload:
        sagaStep.payload !== null && sagaStep.payload !== undefined
          ? JSON.stringify(sagaStep.payload)
          : null,
      result:
        sagaStep.result !== null && sagaStep.result !== undefined
          ? JSON.stringify(sagaStep.result)
          : null,
      createdAt: sagaStep.createdAt,
      updatedAt: sagaStep.updatedAt,
    };
  }

  /**
   * Maps a paginated saga step result to a paginated saga step response dto.
   *
   * @param paginatedResult - The paginated saga step result to map.
   * @returns The paginated saga step response dto.
   */
  public toPaginatedResponseDto(
    paginatedResult: PaginatedResult<SagaStepViewModel>,
  ): PaginatedSagaStepResultDto {
    this.logger.log(
      `Mapping paginated saga step result to response dto: ${JSON.stringify(paginatedResult)}`,
    );
    return {
      items: paginatedResult.items.map((sagaStep) =>
        this.toResponseDto(sagaStep),
      ),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
