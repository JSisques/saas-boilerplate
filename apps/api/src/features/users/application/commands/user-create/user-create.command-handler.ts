import { AssertUserUsernameIsUniqueService } from '@/features/users/application/services/assert-user-username-is-unique/assert-user-username-is-unique.service';
import {
  USER_AGGREGATE_FACTORY_TOKEN,
  UserAggregateFactory,
} from '@/features/users/domain/factories/user.factory';
import {
  USER_WRITE_REPOSITORY_TOKEN,
  UserWriteRepository,
} from '@/features/users/domain/repositories/user-write.repository';
import { UserUuidValueObject } from '@/features/users/domain/value-objects/user-uuid/user-uuid.vo';
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
    @Inject(USER_AGGREGATE_FACTORY_TOKEN)
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
    await this.assertUserUsernameIsUniqueService.execute(
      command.userName.value,
    );
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
