import { AuthNotFoundByEmailException } from '@/auth/application/exceptions/auth-not-found-by-email/auth-not-found-by-email.exception';
import { AuthAggregate } from '@/auth/domain/aggregate/auth.aggregate';
import {
  AUTH_WRITE_REPOSITORY_TOKEN,
  AuthWriteRepository,
} from '@/auth/domain/repositories/auth-write.repository';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertAuthEmailExistsService
  implements IBaseService<string, AuthAggregate>
{
  private readonly logger = new Logger(AssertAuthEmailExistsService.name);

  constructor(
    @Inject(AUTH_WRITE_REPOSITORY_TOKEN)
    private readonly authWriteRepository: AuthWriteRepository,
  ) {}

  async execute(email: string): Promise<AuthAggregate> {
    this.logger.log(`Asserting auth exists by email: ${email}`);

    // 01: Find the auth by email
    const existingAuth = await this.authWriteRepository.findByEmail(email);

    // 02: If the auth does not exist, throw an error
    if (!existingAuth) {
      this.logger.error(`Auth not found by email: ${email}`);
      throw new AuthNotFoundByEmailException(email);
    }

    return existingAuth;
  }
}
