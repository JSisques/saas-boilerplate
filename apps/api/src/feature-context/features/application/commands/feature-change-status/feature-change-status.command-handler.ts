import { FeatureChangeStatusCommand } from '@/feature-context/features/application/commands/feature-change-status/feature-change-status.command';
import { AssertFeatureExistsService } from '@/feature-context/features/application/services/assert-feature-exists/assert-feature-exists.service';
import {
  FEATURE_WRITE_REPOSITORY_TOKEN,
  IFeatureWriteRepository,
} from '@/feature-context/features/domain/repositories/feature-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(FeatureChangeStatusCommand)
export class FeatureChangeStatusCommandHandler
  implements ICommandHandler<FeatureChangeStatusCommand>
{
  private readonly logger = new Logger(FeatureChangeStatusCommandHandler.name);

  constructor(
    @Inject(FEATURE_WRITE_REPOSITORY_TOKEN)
    private readonly featureWriteRepository: IFeatureWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertFeatureExistsService: AssertFeatureExistsService,
  ) {}

  /**
   * Executes the feature change status command
   *
   * @param command - The command to execute
   */
  async execute(command: FeatureChangeStatusCommand): Promise<void> {
    this.logger.log(
      `Executing feature change status command with id ${command.id.value} to status ${command.status.value}`,
    );

    // 01: Assert the feature exists
    const existingFeature = await this.assertFeatureExistsService.execute(
      command.id.value,
    );

    // 02: Change the feature status
    existingFeature.changeStatus(command.status);

    // 03: Save the feature entity
    await this.featureWriteRepository.save(existingFeature);

    // 04: Publish all events
    await this.eventBus.publishAll(existingFeature.getUncommittedEvents());
    await existingFeature.commit();
  }
}
