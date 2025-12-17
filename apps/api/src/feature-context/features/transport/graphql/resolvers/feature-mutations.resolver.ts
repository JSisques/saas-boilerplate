import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { FeatureChangeStatusCommand } from '@/feature-context/features/application/commands/feature-change-status/feature-change-status.command';
import { FeatureCreateCommand } from '@/feature-context/features/application/commands/feature-create/feature-create.command';
import { FeatureDeleteCommand } from '@/feature-context/features/application/commands/feature-delete/feature-delete.command';
import { FeatureUpdateCommand } from '@/feature-context/features/application/commands/feature-update/feature-update.command';
import { CreateFeatureRequestDto } from '@/feature-context/features/transport/graphql/dtos/requests/create-feature.request.dto';
import { DeleteFeatureRequestDto } from '@/feature-context/features/transport/graphql/dtos/requests/delete-feature.request.dto';
import { FeatureChangeStatusRequestDto } from '@/feature-context/features/transport/graphql/dtos/requests/feature-change-status.request.dto';
import { UpdateFeatureRequestDto } from '@/feature-context/features/transport/graphql/dtos/requests/update-feature.request.dto';
import { UserRoleEnum } from '@/prisma/master/client';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { Logger, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
export class FeatureMutationsResolver {
  private readonly logger = new Logger(FeatureMutationsResolver.name);
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  @Mutation(() => MutationResponseDto)
  async createFeature(
    @Args('input') input: CreateFeatureRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Creating feature with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    const createdFeatureId = await this.commandBus.execute(
      new FeatureCreateCommand({
        key: input.key,
        name: input.name,
        description: input.description,
        status: input.status,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Feature created successfully',
      id: createdFeatureId,
    });
  }

  @Mutation(() => MutationResponseDto)
  async updateFeature(
    @Args('input') input: UpdateFeatureRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Updating feature with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new FeatureUpdateCommand({
        id: input.id,
        key: input.key,
        name: input.name,
        description: input.description,
        status: input.status,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Feature updated successfully',
      id: input.id,
    });
  }

  @Mutation(() => MutationResponseDto)
  async deleteFeature(
    @Args('input') input: DeleteFeatureRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Deleting feature with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(new FeatureDeleteCommand({ id: input.id }));

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Feature deleted successfully',
      id: input.id,
    });
  }

  @Mutation(() => MutationResponseDto)
  async changeFeatureStatus(
    @Args('input') input: FeatureChangeStatusRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Changing feature status with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new FeatureChangeStatusCommand({
        id: input.id,
        status: input.status,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Feature status changed successfully',
      id: input.id,
    });
  }
}
