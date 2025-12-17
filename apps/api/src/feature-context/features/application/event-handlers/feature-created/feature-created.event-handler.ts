import { FeatureCreatedEvent } from '@/shared/domain/events/feature-context/features/feature-created/feature-created.event';
import { FeatureViewModelFactory } from '@/feature-context/features/domain/factories/feature-view-model/feature-view-model.factory';
import {
  FEATURE_READ_REPOSITORY_TOKEN,
  IFeatureReadRepository,
} from '@/feature-context/features/domain/repositories/feature-read.repository';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(FeatureCreatedEvent)
export class FeatureCreatedEventHandler
  implements IEventHandler<FeatureCreatedEvent>
{
  private readonly logger = new Logger(FeatureCreatedEventHandler.name);

  constructor(
    @Inject(FEATURE_READ_REPOSITORY_TOKEN)
    private readonly featureReadRepository: IFeatureReadRepository,
    private readonly featureViewModelFactory: FeatureViewModelFactory,
  ) {}

  /**
   * Handles the FeatureCreatedEvent event by creating a new feature view model.
   *
   * @param event - The FeatureCreatedEvent event to handle.
   */
  async handle(event: FeatureCreatedEvent) {
    this.logger.log(`Handling feature created event: ${event.aggregateId}`);

    this.logger.debug(
      `Feature created event data: ${JSON.stringify(event.data)}`,
    );

    // 01: Create the feature view model
    const featureCreatedViewModel: FeatureViewModel =
      this.featureViewModelFactory.fromPrimitives(event.data);

    // 02: Save the feature view model
    await this.featureReadRepository.save(featureCreatedViewModel);
  }
}
