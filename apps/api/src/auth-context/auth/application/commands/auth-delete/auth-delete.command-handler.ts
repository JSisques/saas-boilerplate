import { AuthDeleteCommand } from '@/auth-context/auth/application/commands/auth-delete/auth-delete.command';
import { AssertAuthExistsService } from '@/auth-context/auth/application/services/assert-auth-exsists/assert-auth-exsists.service';
import {
  AUTH_WRITE_REPOSITORY_TOKEN,
  AuthWriteRepository,
} from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(AuthDeleteCommand)
export class AuthDeleteCommandHandler
  implements ICommandHandler<AuthDeleteCommand>
{
  private readonly logger = new Logger(AuthDeleteCommandHandler.name);

  constructor(
    @Inject(AUTH_WRITE_REPOSITORY_TOKEN)
    private readonly authWriteRepository: AuthWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertAuthExistsService: AssertAuthExistsService,
  ) {}

  async execute(command: AuthDeleteCommand): Promise<void> {
    this.logger.log(`Executing delete auth command by id: ${command.id}`);

    // 01: Check if the auth exists
    const existingAuth = await this.assertAuthExistsService.execute(command.id);

    // 02: Delete the auth
    await existingAuth.delete();

    // 03: Delete the auth from the repository
    await this.authWriteRepository.delete(existingAuth.id.value);

    // 04: Publish the auth deleted event
    await this.eventBus.publishAll(existingAuth.getUncommittedEvents());
    await existingAuth.commit();
  }
}
