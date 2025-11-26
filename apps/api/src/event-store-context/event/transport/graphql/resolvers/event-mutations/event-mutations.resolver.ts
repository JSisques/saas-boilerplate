import { EventReplayCommand } from '@/event-store-context/event/application/commands/event-replay/event-replay.command';
import { EventReplayRequestDto } from '@/event-store-context/event/transport/graphql/dtos/requests/event-replay.request.dto';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class EventMutationResolver {
  private readonly logger = new Logger(EventMutationResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  @Mutation(() => MutationResponseDto)
  async eventReplay(
    @Args('input') input: EventReplayRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Replaying events with input: ${JSON.stringify(input)}`);

    // 01: Execute command
    const totalEvents = await this.commandBus.execute(
      new EventReplayCommand(input),
    );

    // 02: Convert to response DTO
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: `Replayed ${totalEvents} event(s)`,
    });
  }
}
