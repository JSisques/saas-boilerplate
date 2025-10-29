import { AuthEmailAlreadyExistsException } from '@/auth-context/auth/application/exceptions/auth-email-already-exists/auth-email-already-exists.exception';
import {
  AUTH_WRITE_REPOSITORY_TOKEN,
  AuthWriteRepository,
} from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertAuthEmailNotExistsService
  implements IBaseService<string, void>
{
  private readonly logger = new Logger(AssertAuthEmailNotExistsService.name);

  constructor(
    @Inject(AUTH_WRITE_REPOSITORY_TOKEN)
    private readonly authWriteRepository: AuthWriteRepository,
  ) {}

  async execute(email: string): Promise<void> {
    this.logger.log(`Asserting auth email not exists by email: ${email}`);

    // 01: Find the auth email not exists by email
    const existingAuth = await this.authWriteRepository.findByEmail(email);

    // 02: If the auth email exists, throw an error
    if (existingAuth) {
      this.logger.error(`Auth email ${email} already exists`);
      throw new AuthEmailAlreadyExistsException(email);
    }
  }
}
