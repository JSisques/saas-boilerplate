import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import {
  PaginatedSagaInstanceResultDto,
  SagaInstanceResponseDto,
} from '@/saga-context/saga-instance/transport/graphql/dtos/responses/saga-instance.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaInstanceGraphQLMapper {
  private readonly logger = new Logger(SagaInstanceGraphQLMapper.name);

  /**
   * Maps a saga instance view model to a saga instance response dto.
   *
   * @param sagaInstance - The saga instance view model to map.
   * @returns The saga instance response dto.
   */
  public toResponseDto(
    sagaInstance: SagaInstanceViewModel,
  ): SagaInstanceResponseDto {
    this.logger.log(
      `Mapping saga instance view model to response dto: ${sagaInstance.id}`,
    );
    return {
      id: sagaInstance.id,
      name: sagaInstance.name,
      status: sagaInstance.status,
      startDate: sagaInstance.startDate,
      endDate: sagaInstance.endDate,
      createdAt: sagaInstance.createdAt,
      updatedAt: sagaInstance.updatedAt,
    };
  }

  /**
   * Maps a paginated saga instance result to a paginated saga instance response dto.
   *
   * @param paginatedResult - The paginated saga instance result to map.
   * @returns The paginated saga instance response dto.
   */
  public toPaginatedResponseDto(
    paginatedResult: PaginatedResult<SagaInstanceViewModel>,
  ): PaginatedSagaInstanceResultDto {
    this.logger.log(
      `Mapping paginated saga instance result to response dto: ${JSON.stringify(paginatedResult)}`,
    );
    return {
      items: paginatedResult.items.map((sagaInstance) =>
        this.toResponseDto(sagaInstance),
      ),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
