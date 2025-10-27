import { AuthUpdateCommand } from '@/auth/application/commands/auth-update/auth-update.command';
import { AssertAuthExistsService } from '@/auth/application/services/assert-auth-exsists/assert-auth-exsists.service';
import { AuthAggregate } from '@/auth/domain/aggregate/auth.aggregate';
import { IAuthUpdateDto } from '@/auth/domain/dtos/entities/auth-update/auth-update.dto';
import {
  AUTH_WRITE_REPOSITORY_TOKEN,
  AuthWriteRepository,
} from '@/auth/domain/repositories/auth-write.repository';
import { BaseUpdateCommandHandler } from '@/shared/application/commands/update/base-update.command-handler';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(AuthUpdateCommand)
export class AuthUpdateCommandHandler
  extends BaseUpdateCommandHandler<AuthUpdateCommand, IAuthUpdateDto>
  implements ICommandHandler<AuthUpdateCommand>
{
  protected readonly logger = new Logger(AuthUpdateCommandHandler.name);

  constructor(
    @Inject(AUTH_WRITE_REPOSITORY_TOKEN)
    private readonly authWriteRepository: AuthWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertAuthExistsService: AssertAuthExistsService,
  ) {
    super();
  }

  /**
   * Executes the update auth command
   *
   * @param command - The command to execute
   */
  async execute(command: AuthUpdateCommand): Promise<void> {
    this.logger.log(`Executing update auth command by id: ${command.id}`);

    // 01: Check if the auth exists
    const existingAuth: AuthAggregate =
      await this.assertAuthExistsService.execute(command.id.value);

    // 02: Extract update data excluding the id field
    const updateData = this.extractUpdateData(command, ['id']);
    this.logger.debug(`Update data: ${JSON.stringify(updateData)}`);

    // 03: Update the auth
    existingAuth.update(updateData);

    // 04: Save the auth
    await this.authWriteRepository.save(existingAuth);

    // 05: Publish the auth updated event
    await this.eventBus.publishAll(existingAuth.getUncommittedEvents());
    await existingAuth.commit();
  }
}
