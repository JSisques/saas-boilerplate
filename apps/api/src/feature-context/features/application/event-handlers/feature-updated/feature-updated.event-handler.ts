import { FeatureUpdatedEvent } from '@/shared/domain/events/feature-context/features/feature-updated/feature-updated.event';
import { AssertFeatureViewModelExistsService } from '@/feature-context/features/application/services/assert-feature-view-model-exists/assert-feature-view-model-exists.service';
import {
  FEATURE_READ_REPOSITORY_TOKEN,
  IFeatureReadRepository,
} from '@/feature-context/features/domain/repositories/feature-read.repository';
import { IFeatureUpdateViewModelDto } from '@/feature-context/features/domain/dtos/view-models/feature-update/feature-update-view-model.dto';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(FeatureUpdatedEvent)
export class FeatureUpdatedEventHandler
  implements IEventHandler<FeatureUpdatedEvent>
{
  private readonly logger = new Logger(FeatureUpdatedEventHandler.name);

  constructor(
    @Inject(FEATURE_READ_REPOSITORY_TOKEN)
    private readonly featureReadRepository: IFeatureReadRepository,
    private readonly assertFeatureViewModelExistsService: AssertFeatureViewModelExistsService,
  ) {}

  /**
   * Handles the FeatureUpdatedEvent event by updating the feature view model.
   *
   * @param event - The FeatureUpdatedEvent event to handle.
   */
  async handle(event: FeatureUpdatedEvent) {
    this.logger.log(`Handling feature updated event: ${event.aggregateId}`);

    this.logger.debug(
      `Feature updated event data: ${JSON.stringify(event.data)}`,
    );

    // 01: Assert the feature view model exists
    const existingFeatureViewModel =
      await this.assertFeatureViewModelExistsService.execute(event.aggregateId);

    // 02: Extract update data from event
    const updateData: IFeatureUpdateViewModelDto = {
      key: event.data.key,
      name: event.data.name,
      description: event.data.description,
      status: event.data.status,
      updatedAt: event.data.updatedAt,
    };

    // 03: Update the feature view model
    existingFeatureViewModel.update(updateData);

    // 04: Save the updated feature view model
    await this.featureReadRepository.save(existingFeatureViewModel);
  }
}
