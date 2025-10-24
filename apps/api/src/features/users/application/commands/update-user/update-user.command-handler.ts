import { UpdateUserCommand } from '@/features/users/application/commands/update-user/update-user.command';
import { UserNotFoundException } from '@/features/users/application/exceptions/user-not-found/user-not-found.exception';
import {
  USER_WRITE_REPOSITORY_TOKEN,
  UserWriteRepository,
} from '@/features/users/domain/repositories/user-write.repository';
import { UserAvatarValueObject } from '@/features/users/domain/value-objects/user-avatar/user-avatar.vo';
import { UserBioValueObject } from '@/features/users/domain/value-objects/user-bio/user-bio.vo';
import { UserNameValueObject } from '@/features/users/domain/value-objects/user-name/user-name.vo';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    @Inject(USER_WRITE_REPOSITORY_TOKEN)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Executes the update user command
   *
   * @param command - The command to execute
   */
  async execute(command: UpdateUserCommand): Promise<void> {
    // 01: Check if the user exists
    const existingUser = await this.userWriteRepository.findById(
      command.userId,
    );

    // 02: If the user does not exist, throw an error
    if (!existingUser) {
      throw new UserNotFoundException(command.userId);
    }

    // 03: Create the update data object
    const updateData: {
      name?: UserNameValueObject;
      bio?: UserBioValueObject;
      avatar?: UserAvatarValueObject;
    } = {};

    // 04: Check if the name is provided to be updated
    if (command.data.name) {
      updateData.name = new UserNameValueObject(command.data.name);
    }

    // 05: Check if the avatar is provided to be updated
    if (command.data.avatar) {
      updateData.avatar = new UserAvatarValueObject(command.data.avatar);
    }

    // 06: Check if the bio is provided to be updated
    if (command.data.bio) {
      updateData.bio = new UserBioValueObject(command.data.bio);
    }

    // 07: Update the user
    existingUser.update(updateData);

    // 08: Save the user
    await this.userWriteRepository.save(existingUser);

    // 09: Publish the user updated event
    await this.eventBus.publishAll(existingUser.getUncommittedEvents());
  }
}
