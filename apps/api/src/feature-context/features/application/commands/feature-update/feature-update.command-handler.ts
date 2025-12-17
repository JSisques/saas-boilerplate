import { BaseUpdateCommandHandler } from '@/shared/application/commands/update/base-update/base-update.command-handler';
import { FeatureUpdateCommand } from '@/feature-context/features/application/commands/feature-update/feature-update.command';
import { AssertFeatureExistsService } from '@/feature-context/features/application/services/assert-feature-exists/assert-feature-exists.service';
import { IFeatureUpdateDto } from '@/feature-context/features/domain/dtos/entities/feature-update/feature-update.dto';
import {
  FEATURE_WRITE_REPOSITORY_TOKEN,
  IFeatureWriteRepository,
} from '@/feature-context/features/domain/repositories/feature-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(FeatureUpdateCommand)
export class FeatureUpdateCommandHandler
  extends BaseUpdateCommandHandler<FeatureUpdateCommand, IFeatureUpdateDto>
  implements ICommandHandler<FeatureUpdateCommand>
{
  protected readonly logger = new Logger(FeatureUpdateCommandHandler.name);

  constructor(
    @Inject(FEATURE_WRITE_REPOSITORY_TOKEN)
    private readonly featureWriteRepository: IFeatureWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertFeatureExistsService: AssertFeatureExistsService,
  ) {
    super();
  }

  /**
   * Executes the update feature command
   *
   * @param command - The command to execute
   */
  async execute(command: FeatureUpdateCommand): Promise<void> {
    this.logger.log(`Executing update feature command by id: ${command.id}`);

    // 01: Check if the feature exists
    const existingFeature = await this.assertFeatureExistsService.execute(
      command.id.value,
    );

    // 02: Extract update data excluding the id field
    const updateData = this.extractUpdateData(command, ['id']);
    this.logger.debug(`Update data: ${JSON.stringify(updateData)}`);

    // 03: Update the feature
    existingFeature.update(updateData);

    // 04: Save the feature
    await this.featureWriteRepository.save(existingFeature);

    // 05: Publish the feature updated event
    await this.eventBus.publishAll(existingFeature.getUncommittedEvents());
    await existingFeature.commit();
  }
}
