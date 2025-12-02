import { SagaStepChangeStatusCommand } from '@/saga-context/saga-step/application/commands/saga-step-change-status/saga-step-change-status.command';
import { SagaStepCreateCommand } from '@/saga-context/saga-step/application/commands/saga-step-create/saga-step-create.command';
import { SagaStepDeleteCommand } from '@/saga-context/saga-step/application/commands/saga-step-delete/saga-step-delete.command';
import { SagaStepUpdateCommand } from '@/saga-context/saga-step/application/commands/saga-step-update/saga-step-update.command';
import { SagaStepChangeStatusRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-change-status.request.dto';
import { SagaStepCreateRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-create.request.dto';
import { SagaStepDeleteRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-delete.request.dto';
import { SagaStepUpdateRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-update.request.dto';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
// TODO: Add guards and roles
export class SagaStepMutationsResolver {
  private readonly logger = new Logger(SagaStepMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  @Mutation(() => MutationResponseDto)
  async sagaStepCreate(
    @Args('input') input: SagaStepCreateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Creating saga step: ${input.name} for saga instance: ${input.sagaInstanceId}`,
    );

    // 01: Parse payload JSON string to object
    let payload: any = {};
    try {
      payload = JSON.parse(input.payload);
    } catch (error) {
      throw new Error('Invalid JSON payload format');
    }

    // 02: Send the command to the command bus
    const sagaStepId = await this.commandBus.execute(
      new SagaStepCreateCommand({
        sagaInstanceId: input.sagaInstanceId,
        name: input.name,
        order: input.order,
        payload: payload,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Saga step created successfully',
      id: sagaStepId,
    });
  }

  @Mutation(() => MutationResponseDto)
  async sagaStepUpdate(
    @Args('input') input: SagaStepUpdateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Updating saga step by id: ${input.id}`);

    // 01: Parse payload and result JSON strings to objects if provided
    let payload: any | undefined;
    let result: any | undefined;

    if (input.payload !== undefined) {
      try {
        payload = JSON.parse(input.payload);
      } catch (error) {
        throw new Error('Invalid JSON payload format');
      }
    }

    if (input.result !== undefined) {
      try {
        result = JSON.parse(input.result);
      } catch (error) {
        throw new Error('Invalid JSON result format');
      }
    }

    // 02: Send the command to the command bus
    await this.commandBus.execute(
      new SagaStepUpdateCommand({
        id: input.id,
        name: input.name,
        order: input.order,
        status: input.status,
        startDate: input.startDate,
        endDate: input.endDate,
        errorMessage: input.errorMessage,
        retryCount: input.retryCount,
        maxRetries: input.maxRetries,
        payload: payload,
        result: result,
      }),
    );

    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Saga step updated successfully',
      id: input.id,
    });
  }

  @Mutation(() => MutationResponseDto)
  async sagaStepChangeStatus(
    @Args('input') input: SagaStepChangeStatusRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Changing status for saga step with id: ${input.id}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SagaStepChangeStatusCommand({
        id: input.id,
        status: input.status,
      }),
    );

    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Saga step status changed successfully',
      id: input.id,
    });
  }

  @Mutation(() => MutationResponseDto)
  async sagaStepDelete(
    @Args('input') input: SagaStepDeleteRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Deleting saga step by id: ${input.id}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(new SagaStepDeleteCommand({ id: input.id }));

    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Saga step deleted successfully',
      id: input.id,
    });
  }
}
