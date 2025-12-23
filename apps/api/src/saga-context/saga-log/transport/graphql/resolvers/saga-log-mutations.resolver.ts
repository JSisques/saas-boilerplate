import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogDeleteCommand } from '@/saga-context/saga-log/application/commands/saga-log-delete/saga-log-delete.command';
import { SagaLogUpdateCommand } from '@/saga-context/saga-log/application/commands/saga-log-update/saga-log-update.command';
import { SagaLogCreateRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-create.request.dto';
import { SagaLogDeleteRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-delete.request.dto';
import { SagaLogUpdateRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-update.request.dto';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { Logger, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
export class SagaLogMutationsResolver {
  private readonly logger = new Logger(SagaLogMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  @Mutation(() => MutationResponseDto)
  async sagaLogCreate(
    @Args('input') input: SagaLogCreateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Creating saga log for saga instance: ${input.sagaInstanceId} and saga step: ${input.sagaStepId}`,
    );

    // 01: Send the command to the command bus
    const sagaLogId = await this.commandBus.execute(
      new SagaLogCreateCommand({
        sagaInstanceId: input.sagaInstanceId,
        sagaStepId: input.sagaStepId,
        type: input.type,
        message: input.message,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Saga log created successfully',
      id: sagaLogId,
    });
  }

  @Mutation(() => MutationResponseDto)
  async sagaLogUpdate(
    @Args('input') input: SagaLogUpdateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Updating saga log by id: ${input.id}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SagaLogUpdateCommand({
        id: input.id,
        type: input.type,
        message: input.message,
      }),
    );

    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Saga log updated successfully',
      id: input.id,
    });
  }

  @Mutation(() => MutationResponseDto)
  async sagaLogDelete(
    @Args('input') input: SagaLogDeleteRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Deleting saga log by id: ${input.id}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(new SagaLogDeleteCommand({ id: input.id }));

    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Saga log deleted successfully',
      id: input.id,
    });
  }
}
