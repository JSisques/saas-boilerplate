import { FeatureDeletedEvent } from '@/shared/domain/events/feature-context/features/feature-deleted/feature-deleted.event';
import {
  FEATURE_READ_REPOSITORY_TOKEN,
  IFeatureReadRepository,
} from '@/feature-context/features/domain/repositories/feature-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(FeatureDeletedEvent)
export class FeatureDeletedEventHandler
  implements IEventHandler<FeatureDeletedEvent>
{
  private readonly logger = new Logger(FeatureDeletedEventHandler.name);

  constructor(
    @Inject(FEATURE_READ_REPOSITORY_TOKEN)
    private readonly featureReadRepository: IFeatureReadRepository,
  ) {}

  /**
   * Handles the FeatureDeletedEvent event by deleting the feature view model.
   *
   * @param event - The FeatureDeletedEvent event to handle.
   */
  async handle(event: FeatureDeletedEvent) {
    this.logger.log(`Handling feature deleted event: ${event.aggregateId}`);

    // 01: Delete the feature view model
    await this.featureReadRepository.delete(event.aggregateId);
  }
}
