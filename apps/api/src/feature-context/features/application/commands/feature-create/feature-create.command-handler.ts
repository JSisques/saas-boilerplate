import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AssertFeatureKeyIsUniqueService } from '@/feature-context/features/application/services/assert-feature-key-is-unique/assert-feature-key-is-unique.service';
import { FeatureAggregateFactory } from '@/feature-context/features/domain/factories/feature-aggregate/feature-aggregate.factory';
import {
  FEATURE_WRITE_REPOSITORY_TOKEN,
  IFeatureWriteRepository,
} from '@/feature-context/features/domain/repositories/feature-write.repository';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { FeatureCreateCommand } from './feature-create.command';

@CommandHandler(FeatureCreateCommand)
export class FeatureCreateCommandHandler
  implements ICommandHandler<FeatureCreateCommand>
{
  constructor(
    @Inject(FEATURE_WRITE_REPOSITORY_TOKEN)
    private readonly featureWriteRepository: IFeatureWriteRepository,
    private readonly eventBus: EventBus,
    private readonly featureAggregateFactory: FeatureAggregateFactory,
    private readonly assertFeatureKeyIsUniqueService: AssertFeatureKeyIsUniqueService,
  ) {}

  /**
   * Executes the feature create command
   *
   * @param command - The command to execute
   * @returns The created feature id
   */
  async execute(command: FeatureCreateCommand): Promise<string> {
    // 00: Assert the feature key is unique
    await this.assertFeatureKeyIsUniqueService.execute(command.key.value);

    // 01: Create the feature entity
    const now = new Date();
    const feature = this.featureAggregateFactory.create({
      ...command,
      createdAt: new DateValueObject(now),
      updatedAt: new DateValueObject(now),
    });

    // 02: Save the feature entity
    await this.featureWriteRepository.save(feature);

    // 03: Publish all events
    await this.eventBus.publishAll(feature.getUncommittedEvents());

    // 04: Return the feature id
    return feature.id.value;
  }
}
