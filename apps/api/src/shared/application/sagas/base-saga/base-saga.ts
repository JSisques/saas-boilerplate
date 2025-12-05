import { SagaInstanceChangeStatusCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-change-status/saga-instance-change-status.command';
import { SagaInstanceCreateCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-create/saga-instance-create.command';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaStepCreateCommand } from '@/saga-context/saga-step/application/commands/saga-step-create/saga-step-create.command';
import { SagaStepUpdateCommand } from '@/saga-context/saga-step/application/commands/saga-step-update/saga-step-update.command';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

/**
 * Configuration for a saga step
 */
export interface ISagaStepConfig<T = unknown> {
  name: string;
  order: number;
  payload: Record<string, unknown>;
  action: () => Promise<T>;
}

/**
 * Base class for saga implementations
 *
 * This abstract class provides common functionality for managing saga instances
 * and steps, including state tracking, error handling, and result storage.
 *
 * @abstract
 */
export abstract class BaseSaga {
  protected readonly logger: Logger;

  constructor(protected readonly commandBus: CommandBus) {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Creates a new saga instance and marks it as running
   *
   * @param sagaName - The name of the saga instance
   * @returns The saga instance ID
   */
  protected async createSagaInstance(sagaName: string): Promise<string> {
    const sagaInstanceId = await this.commandBus.execute(
      new SagaInstanceCreateCommand({
        name: sagaName,
      }),
    );

    // Mark saga as running
    await this.commandBus.execute(
      new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.RUNNING,
      }),
    );

    return sagaInstanceId;
  }

  /**
   * Executes a saga step with proper state tracking
   *
   * @param sagaInstanceId - The saga instance ID
   * @param stepConfig - Step configuration including name, order, payload, and action
   * @returns The result of the step action
   */
  protected async executeStep<T>(
    sagaInstanceId: string,
    stepConfig: ISagaStepConfig<T>,
  ): Promise<T> {
    const stepStartTime = new Date();

    // 01: Create the step
    const sagaStepId = await this.commandBus.execute(
      new SagaStepCreateCommand({
        sagaInstanceId,
        name: stepConfig.name,
        order: stepConfig.order,
        payload: stepConfig.payload,
      }),
    );

    try {
      // 02: Mark step as running (with start date)
      await this.commandBus.execute(
        new SagaStepUpdateCommand({
          id: sagaStepId,
          status: SagaStepStatusEnum.RUNNING,
          startDate: stepStartTime,
        }),
      );

      // 03: Execute the step action
      const result = await stepConfig.action();

      // 04: Mark step as completed with result
      await this.commandBus.execute(
        new SagaStepUpdateCommand({
          id: sagaStepId,
          status: SagaStepStatusEnum.COMPLETED,
          endDate: new Date(),
          result: result as any,
        }),
      );

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // 05: Mark step as failed with error
      await this.commandBus.execute(
        new SagaStepUpdateCommand({
          id: sagaStepId,
          status: SagaStepStatusEnum.FAILED,
          endDate: new Date(),
          errorMessage,
        }),
      );

      throw error;
    }
  }

  /**
   * Marks the saga instance as completed
   *
   * @param sagaInstanceId - The saga instance ID
   */
  protected async completeSagaInstance(sagaInstanceId: string): Promise<void> {
    await this.commandBus.execute(
      new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.COMPLETED,
      }),
    );
  }

  /**
   * Marks the saga instance as failed
   *
   * @param sagaInstanceId - The saga instance ID
   */
  protected async failSagaInstance(sagaInstanceId: string): Promise<void> {
    await this.commandBus.execute(
      new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.FAILED,
      }),
    );
  }
}
