import { AuthNotFoundException } from '@/auth-context/auth/application/exceptions/auth-not-found/auth-not-found.exception';
import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import {
  AUTH_WRITE_REPOSITORY_TOKEN,
  AuthWriteRepository,
} from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertAuthExistsService
  implements IBaseService<string, AuthAggregate>
{
  private readonly logger = new Logger(AssertAuthExistsService.name);

  constructor(
    @Inject(AUTH_WRITE_REPOSITORY_TOKEN)
    private readonly authWriteRepository: AuthWriteRepository,
  ) {}

  async execute(id: string): Promise<AuthAggregate> {
    this.logger.log(`Asserting auth exists by id: ${id}`);

    // 01: Find the user by id
    const existingAuth = await this.authWriteRepository.findById(id);

    // 02: If the auth does not exist, throw an error
    if (!existingAuth) {
      this.logger.error(`Auth not found by id: ${id}`);
      throw new AuthNotFoundException(id);
    }

    return existingAuth;
  }
}
