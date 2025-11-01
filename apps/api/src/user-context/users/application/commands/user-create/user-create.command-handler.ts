import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { AssertUserUsernameIsUniqueService } from '@/user-context/users/application/services/assert-user-username-is-unique/assert-user-username-is-unique.service';
import { UserAggregateFactory } from '@/user-context/users/domain/factories/user-aggregate/user-aggregate.factory';
import {
  USER_WRITE_REPOSITORY_TOKEN,
  UserWriteRepository,
} from '@/user-context/users/domain/repositories/user-write.repository';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserCreateCommand } from './user-create.command';

@CommandHandler(UserCreateCommand)
export class UserCreateCommandHandler
  implements ICommandHandler<UserCreateCommand>
{
  constructor(
    @Inject(USER_WRITE_REPOSITORY_TOKEN)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly eventBus: EventBus,
    private readonly userAggregateFactory: UserAggregateFactory,
    private readonly assertUserUsernameIsUniqueService: AssertUserUsernameIsUniqueService,
  ) {}

  /**
   * Executes the user create command
   *
   * @param command - The command to execute
   * @returns The created user id
   */
  async execute(command: UserCreateCommand): Promise<string> {
    // 00: Assert the user username is unique
    if (command.userName) {
      await this.assertUserUsernameIsUniqueService.execute(
        command.userName.value,
      );
    }
    // 01: Create the user entity
    const user = this.userAggregateFactory.create({
      id: UserUuidValueObject.generate().value,
      ...command,
    });

    // 02: Save the user entity
    await this.userWriteRepository.save(user);

    // 03: Publish all events
    await this.eventBus.publishAll(user.getUncommittedEvents());

    // 04: Return the user id
    return user.id.value;
  }
}
