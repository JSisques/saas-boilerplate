import { UserUpdateCommand } from '@/features/users/application/commands/user-update/user-update.command';
import { AssertUserExsistsService } from '@/features/users/application/services/assert-user-exsits/assert-user-exsits.service';
import { IUserUpdateDto } from '@/features/users/domain/dtos/entities/user-update/user-update.dto';
import {
  USER_WRITE_REPOSITORY_TOKEN,
  UserWriteRepository,
} from '@/features/users/domain/repositories/user-write.repository';
import { BaseUpdateCommandHandler } from '@/shared/application/commands/update/base-update.command-handler';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UserUpdateCommand)
export class UserUpdateCommandHandler
  extends BaseUpdateCommandHandler<UserUpdateCommand, IUserUpdateDto>
  implements ICommandHandler<UserUpdateCommand>
{
  protected readonly logger = new Logger(UserUpdateCommandHandler.name);

  constructor(
    @Inject(USER_WRITE_REPOSITORY_TOKEN)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertUserExsistsService: AssertUserExsistsService,
  ) {
    super();
  }

  /**
   * Executes the update user command
   *
   * @param command - The command to execute
   */
  async execute(command: UserUpdateCommand): Promise<void> {
    this.logger.log(`Executing update user command by id: ${command.id}`);

    // 01: Check if the user exists
    const existingUser = await this.assertUserExsistsService.execute(
      command.id.value,
    );

    // 02: Extract update data excluding the id field
    const updateData = this.extractUpdateData(command, ['id']);
    this.logger.debug(`Update data: ${JSON.stringify(updateData)}`);

    // 03: Update the user
    existingUser.update(updateData);

    // 04: Save the user
    await this.userWriteRepository.save(existingUser);

    // 05: Publish the user updated event
    await this.eventBus.publishAll(existingUser.getUncommittedEvents());
    await existingUser.commit();
  }
}
