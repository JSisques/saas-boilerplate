import { UserUpdateCommand } from '@/features/users/application/commands/user-update/user-update.command';
import { AssertUserExistsService } from '@/features/users/application/services/assert-user-exsits/assert-user-exsits.service';
import {
  USER_WRITE_REPOSITORY_TOKEN,
  UserWriteRepository,
} from '@/features/users/domain/repositories/user-write.repository';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UserUpdateCommand)
export class UserUpdateCommandHandler
  implements ICommandHandler<UserUpdateCommand>
{
  constructor(
    @Inject(USER_WRITE_REPOSITORY_TOKEN)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertUserExistsService: AssertUserExistsService,
  ) {}

  /**
   * Executes the update user command
   *
   * @param command - The command to execute
   */
  async execute(command: UserUpdateCommand): Promise<void> {
    // 01: Check if the user exists
    const existingUser = await this.assertUserExistsService.execute(
      command.id.value,
    );

    // 02: Update the user
    existingUser.update(command);

    // 03: Save the user
    await this.userWriteRepository.save(existingUser);

    // 04: Publish the user updated event
    await this.eventBus.publishAll(existingUser.getUncommittedEvents());
    await existingUser.commit();
  }
}
