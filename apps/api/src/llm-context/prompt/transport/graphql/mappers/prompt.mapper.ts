import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import {
  PaginatedPromptResultDto,
  PromptResponseDto,
} from '@/llm-context/prompt/transport/graphql/dtos/responses/prompt.response.dto';
import { PromptStatusEnum } from '@/prisma/master/client';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PromptGraphQLMapper {
  private readonly logger = new Logger(PromptGraphQLMapper.name);

  toResponseDto(prompt: PromptViewModel): PromptResponseDto {
    this.logger.log(`Mapping prompt view model to response dto: ${prompt.id}`);
    return {
      id: prompt.id,
      slug: prompt.slug,
      version: prompt.version,
      title: prompt.title,
      description: prompt.description,
      content: prompt.content,
      status: prompt.status as PromptStatusEnum,
      isActive: prompt.isActive,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<PromptViewModel>,
  ): PaginatedPromptResultDto {
    return {
      items: paginatedResult.items.map((prompt) => this.toResponseDto(prompt)),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
