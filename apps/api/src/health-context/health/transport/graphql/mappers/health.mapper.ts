import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';
import {
  HealthResponseDto,
  PaginatedHealthResultDto,
} from '@/health-context/health/transport/graphql/dtos/responses/health.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthGraphQLMapper {
  toResponseDto(health: HealthViewModel): HealthResponseDto {
    return {
      status: health.status,
      writeDatabaseStatus: health.writeDatabaseStatus,
      readDatabaseStatus: health.readDatabaseStatus,
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
