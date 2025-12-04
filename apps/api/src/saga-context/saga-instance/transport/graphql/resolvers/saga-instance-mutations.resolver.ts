import { SagaInstanceChangeStatusCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-change-status/saga-instance-change-status.command';
import { SagaInstanceCreateCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-create/saga-instance-create.command';
import { SagaInstanceDeleteCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-delete/saga-instance-delete.command';
import { SagaInstanceUpdateCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-update/saga-instance-update.command';
import { SagaInstanceChangeStatusRequestDto } from '@/saga-context/saga-instance/transport/graphql/dtos/requests/saga-instance-change-status.request.dto';
import { SagaInstanceCreateRequestDto } from '@/saga-context/saga-instance/transport/graphql/dtos/requests/saga-instance-create.request.dto';
import { SagaInstanceDeleteRequestDto } from '@/saga-context/saga-instance/transport/graphql/dtos/requests/saga-instance-delete.request.dto';
import { SagaInstanceUpdateRequestDto } from '@/saga-context/saga-instance/transport/graphql/dtos/requests/saga-instance-update.request.dto';
import { SagaInstanceGraphQLMapper } from '@/saga-context/saga-instance/transport/graphql/mappers/saga-instance.mapper';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
// TODO: Add guards and roles
export class SagaInstanceMutationsResolver {
  private readonly logger = new Logger(SagaInstanceMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
    private readonly sagaInstanceGraphQLMapper: SagaInstanceGraphQLMapper,
  ) {}

  @Mutation(() => MutationResponseDto)
  async sagaInstanceCreate(
    @Args('input') input: SagaInstanceCreateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Creating saga instance: ${input.name}`);

    // 01: Send the command to the command bus
    const sagaInstanceId = await this.commandBus.execute(
      new SagaInstanceCreateCommand({ name: input.name }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Saga instance created successfully',
      id: sagaInstanceId,
    });
  }

  @Mutation(() => MutationResponseDto)
  async sagaInstanceUpdate(
    @Args('input') input: SagaInstanceUpdateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Updating saga instance by id: ${input.id}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SagaInstanceUpdateCommand({
        id: input.id,
        endDate: input.endDate,
        name: input.name,
        status: input.status,
        startDate: input.startDate,
      }),
    );

    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Saga instance updated successfully',
      id: input.id,
    });
  }

  @Mutation(() => MutationResponseDto)
  async sagaInstanceChangeStatus(
    @Args('input') input: SagaInstanceChangeStatusRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Changing status for saga instance with id: ${input.id}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SagaInstanceChangeStatusCommand({
        id: input.id,
        status: input.status,
      }),
    );

    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Saga instance deleted successfully',
      id: input.id,
    });
  }

  @Mutation(() => MutationResponseDto)
  async sagaInstanceDelete(
    @Args('input') input: SagaInstanceDeleteRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Deleting saga instance by id: ${input.id}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SagaInstanceDeleteCommand({ id: input.id }),
    );

    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Saga instance deleted successfully',
      id: input.id,
    });
  }
}
