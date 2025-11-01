import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';
import { PaginatedHealthResultDto } from '@/health-context/health/transport/graphql/dtos/responses/health.response.dto';
import { HealthRestResponseDto } from '@/health-context/health/transport/rest/dtos/responses/health.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

export class HealthRestMapper {
  toResponseDto(health: HealthViewModel): HealthRestResponseDto {
    return {
      status: health.status,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<HealthViewModel>,
  ): PaginatedHealthResultDto {
    return {
      items: paginatedResult.items.map((health) => this.toResponseDto(health)),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
