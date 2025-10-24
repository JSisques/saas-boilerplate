import { Logger } from '@nestjs/common';
import { BaseDatabaseRepository } from '@shared/infrastructure/database/base-database.repository';
import { PrismaService } from '@shared/infrastructure/database/prisma/prisma.service';

export class BasePrismaRepository extends BaseDatabaseRepository {
  constructor(protected readonly prismaService: PrismaService) {
    super();
    this.logger = new Logger(BasePrismaRepository.name);
  }
}
