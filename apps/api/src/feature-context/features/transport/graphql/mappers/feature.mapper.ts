import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import {
  PaginatedFeatureResultDto,
  FeatureResponseDto,
} from '@/feature-context/features/transport/graphql/dtos/responses/feature.response.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FeatureGraphQLMapper {
  private readonly logger = new Logger(FeatureGraphQLMapper.name);

  toResponseDto(feature: FeatureViewModel): FeatureResponseDto {
    this.logger.log(
      `Mapping feature view model to response dto: ${feature.id}`,
    );

    return {
      id: feature.id,
      key: feature.key,
      name: feature.name,
      description: feature.description,
      status: feature.status,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<FeatureViewModel>,
  ): PaginatedFeatureResultDto {
    this.logger.log(
      `Mapping paginated feature result to response dto: ${JSON.stringify(paginatedResult)}`,
    );
    return {
      items: paginatedResult.items.map((feature) =>
        this.toResponseDto(feature),
      ),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
