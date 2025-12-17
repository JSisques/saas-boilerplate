import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureAggregateFactory } from '@/feature-context/features/domain/factories/feature-aggregate/feature-aggregate.factory';
import {
  FEATURE_WRITE_REPOSITORY_TOKEN,
  IFeatureWriteRepository,
} from '@/feature-context/features/domain/repositories/feature-write.repository';
import { FeatureKeyIsNotUniqueException } from '@/feature-context/features/application/exceptions/feature-key-is-not-unique/feature-key-is-not-unique.exception';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { FeatureCreateCommand } from './feature-create.command';

@CommandHandler(FeatureCreateCommand)
export class FeatureCreateCommandHandler
  implements ICommandHandler<FeatureCreateCommand>
{
  private readonly logger = new Logger(FeatureCreateCommandHandler.name);

  constructor(
    @Inject(FEATURE_WRITE_REPOSITORY_TOKEN)
    private readonly featureWriteRepository: IFeatureWriteRepository,
    private readonly eventBus: EventBus,
    private readonly featureAggregateFactory: FeatureAggregateFactory,
  ) {}

  /**
   * Executes the feature create command
   *
   * @param command - The command to execute
   * @returns The created feature id
   */
  async execute(command: FeatureCreateCommand): Promise<string> {
    // 01: Create the feature entity
    const now = new Date();
    const feature = this.featureAggregateFactory.create({
      ...command,
      createdAt: new DateValueObject(now),
      updatedAt: new DateValueObject(now),
    });

    try {
      // 02: Save the feature entity
      await this.featureWriteRepository.save(feature);

      // 03: Publish all events
      await this.eventBus.publishAll(feature.getUncommittedEvents());

      // 04: Return the feature id
      return feature.id.value;
    } catch (error: any) {
      // Handle unique constraint violation for key
      if (error?.code === 'P2002' && error?.meta?.target?.includes('key')) {
        this.logger.error(`Feature key ${command.key.value} is already taken`);
        throw new FeatureKeyIsNotUniqueException(command.key.value);
      }
      throw error;
    }
  }
}
