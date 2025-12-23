import { FeatureDeleteCommand } from '@/feature-context/features/application/commands/feature-delete/feature-delete.command';
import { AssertFeatureExistsService } from '@/feature-context/features/application/services/assert-feature-exists/assert-feature-exists.service';
import {
  FEATURE_WRITE_REPOSITORY_TOKEN,
  IFeatureWriteRepository,
} from '@/feature-context/features/domain/repositories/feature-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(FeatureDeleteCommand)
export class FeatureDeleteCommandHandler
  implements ICommandHandler<FeatureDeleteCommand>
{
  private readonly logger = new Logger(FeatureDeleteCommandHandler.name);

  constructor(
    @Inject(FEATURE_WRITE_REPOSITORY_TOKEN)
    private readonly featureWriteRepository: IFeatureWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertFeatureExistsService: AssertFeatureExistsService,
  ) {}

  async execute(command: FeatureDeleteCommand): Promise<void> {
    this.logger.log(`Executing delete feature command by id: ${command.id}`);

    // 01: Check if the feature exists
    const existingFeature = await this.assertFeatureExistsService.execute(
      command.id,
    );

    // 02: Delete the feature
    existingFeature.delete();

    // 03: Delete the feature from the repository
    await this.featureWriteRepository.delete(existingFeature.id.value);

    // 04: Publish the feature deleted event
    await this.eventBus.publishAll(existingFeature.getUncommittedEvents());
    await existingFeature.commit();
  }
}
