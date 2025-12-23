import { AssertFeatureViewModelExistsService } from '@/feature-context/features/application/services/assert-feature-view-model-exists/assert-feature-view-model-exists.service';
import { IFeatureUpdateViewModelDto } from '@/feature-context/features/domain/dtos/view-models/feature-update/feature-update-view-model.dto';
import {
  FEATURE_READ_REPOSITORY_TOKEN,
  IFeatureReadRepository,
} from '@/feature-context/features/domain/repositories/feature-read.repository';
import { FeatureStatusChangedEvent } from '@/shared/domain/events/feature-context/features/feature-status-changed/feature-status-changed.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(FeatureStatusChangedEvent)
export class FeatureStatusChangedEventHandler
  implements IEventHandler<FeatureStatusChangedEvent>
{
  private readonly logger = new Logger(FeatureStatusChangedEventHandler.name);

  constructor(
    @Inject(FEATURE_READ_REPOSITORY_TOKEN)
    private readonly featureReadRepository: IFeatureReadRepository,
    private readonly assertFeatureViewModelExistsService: AssertFeatureViewModelExistsService,
  ) {}

  /**
   * Handles the FeatureStatusChangedEvent event by updating the feature view model status.
   *
   * @param event - The FeatureStatusChangedEvent event to handle.
   */
  async handle(event: FeatureStatusChangedEvent) {
    this.logger.log(
      `Handling feature status changed event: ${event.aggregateId}`,
    );

    this.logger.debug(
      `Feature status changed event data: ${JSON.stringify(event.data)}`,
    );

    // 01: Assert the feature view model exists
    const existingFeatureViewModel =
      await this.assertFeatureViewModelExistsService.execute(event.aggregateId);

    // 02: Extract update data from event (only status and updatedAt)
    const updateData: IFeatureUpdateViewModelDto = {
      status: event.data.status,
      updatedAt: event.data.updatedAt,
    };

    // 03: Update the feature view model
    existingFeatureViewModel.update(updateData);

    // 04: Save the updated feature view model
    await this.featureReadRepository.save(existingFeatureViewModel);
  }
}
