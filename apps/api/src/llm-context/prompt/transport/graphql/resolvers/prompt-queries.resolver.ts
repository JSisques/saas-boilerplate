import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { FindPromptsByCriteriaQuery } from '@/llm-context/prompt/application/queries/prompt-find-by-criteria/prompt-find-by-criteria.query';
import { FindPromptViewModelByIdQuery } from '@/llm-context/prompt/application/queries/prompt-find-view-model-by-id/prompt-find-view-model-by-id.query';
import { PromptFindByCriteriaRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-find-by-criteria.request.dto';
import { PromptFindByIdRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-find-by-id.request.dto';
import {
  PaginatedPromptResultDto,
  PromptResponseDto,
} from '@/llm-context/prompt/transport/graphql/dtos/responses/prompt.response.dto';
import { PromptGraphQLMapper } from '@/llm-context/prompt/transport/graphql/mappers/prompt.mapper';
import { UserRoleEnum } from '@/prisma/master/client';
import { Criteria } from '@/shared/domain/entities/criteria';
import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
export class PromptQueryResolver {
  private readonly logger = new Logger(PromptQueryResolver.name);
  constructor(
    private readonly queryBus: QueryBus,
    private readonly promptGraphQLMapper: PromptGraphQLMapper,
  ) {}

  /**
   * Finds subscriptions that satisfy specified criteria such as filtering, sorting, and pagination.
   *
   * @param {SubscriptionFindByCriteriaRequestDto} [input] - Optional input parameters containing filters, sorts, and pagination settings.
   * @returns {Promise<PaginatedSubscriptionResultDto>} A promise resolving to paginated results of subscriptions matching the provided criteria.
   */
  @Query(() => PaginatedPromptResultDto)
  async promptFindByCriteria(
    @Args('input', { nullable: true })
    input?: PromptFindByCriteriaRequestDto,
  ): Promise<PaginatedPromptResultDto> {
    this.logger.log(`Finding prompts with input: ${JSON.stringify(input)}`);

    // 01: Convert DTO to domain Criteria
    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    // 02: Execute query
    const result = await this.queryBus.execute(
      new FindPromptsByCriteriaQuery({ criteria }),
    );

    // 03: Convert to response DTO
    return this.promptGraphQLMapper.toPaginatedResponseDto(result);
  }

  /**
   * Finds a subscription by its ID.
   *
   * @param {SubscriptionFindByIdRequestDto} input - The information containing the ID of the subscription to be found.
   * @returns {Promise<SubscriptionResponseDto>} The subscription matching the provided ID.
   */
  @Query(() => PromptResponseDto)
  async promptFindById(
    @Args('input') input: PromptFindByIdRequestDto,
  ): Promise<PromptResponseDto> {
    this.logger.log(
      `Finding prompt by id with input: ${JSON.stringify(input)}`,
    );

    // 01: Execute query
    const result = await this.queryBus.execute(
      new FindPromptViewModelByIdQuery({ id: input.id }),
    );

    // 02: Convert to response DTO
    return this.promptGraphQLMapper.toResponseDto(result);
  }
}
