import { DeleteUserCommand } from '@/features/users/application/commands/delete-user/delete-user.command';
import { UserNotFoundException } from '@/features/users/application/exceptions/user-not-found/user-not-found.exception';
import { UserAggregate } from '@/features/users/domain/entities/user.aggregate';
import {
  USER_WRITE_REPOSITORY_TOKEN,
  UserWriteRepository,
} from '@/features/users/domain/repositories/user-write.repository';
import { UserDeletedEvent } from '@/shared/domain/events/users/user-deleted/user-deleted.event';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand>
{
  private readonly logger = new Logger(DeleteUserCommandHandler.name);

  constructor(
    @Inject(USER_WRITE_REPOSITORY_TOKEN)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    this.logger.log(`Executing delete user command by id: ${command.userId}`);

    // 01: Find the user by id
    const existingUser = await this.userWriteRepository.findById(
      command.userId,
    );

    // 02: If the user does not exist, throw an error
    if (!existingUser) {
      this.logger.error(`User not found by id: ${command.userId}`);
      throw new UserNotFoundException(command.userId);
    }

    // 04: Delete the user from the repository
    await this.userWriteRepository.delete(existingUser.id.value);

    // 05: Publish the user deleted event
    await this.eventBus.publishAll([
      new UserDeletedEvent(
        {
          aggregateId: existingUser.id.value,
          aggregateType: UserAggregate.name,
          eventType: UserDeletedEvent.name,
        },
        {
          id: existingUser.id.value,
          name: existingUser.name.value,
          bio: existingUser.bio.value,
          avatar: existingUser.avatar.value,
        },
      ),
    ]);
  }
}
