import { EventReplayCommand } from '@/event-store-context/event/application/commands/event-replay/event-replay.command';
import { EventReplayService } from '@/event-store-context/event/application/services/event-replay/event-replay.service';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(EventReplayCommand)
export class EventReplayCommandHandler
  implements ICommandHandler<EventReplayCommand>
{
  private readonly logger = new Logger(EventReplayCommandHandler.name);

  constructor(
    @Inject(EventReplayService)
    private readonly eventReplayService: EventReplayService,
  ) {}

  /**
   * Executes the event replay command
   *
   * @param command - The event replay command
   * @returns The number of events replayed
   */
  async execute(command: EventReplayCommand): Promise<number> {
    this.logger.log(`Executing event replay command`);

    const count = await this.eventReplayService.execute({
      id: command.id,
      eventType: command.eventType,
      aggregateId: command.aggregateId,
      aggregateType: command.aggregateType,
      from: command.from,
      to: command.to,
      batchSize: command.batchSize,
    });

    this.logger.log(`Replayed ${count} event(s)`);
    return count;
  }
}
