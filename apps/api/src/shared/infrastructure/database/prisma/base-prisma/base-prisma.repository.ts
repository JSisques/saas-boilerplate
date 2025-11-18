import { BaseDatabaseRepository } from '@/shared/infrastructure/database/base-database.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/services/prisma.service';
import { Logger } from '@nestjs/common';

export class BasePrismaRepository extends BaseDatabaseRepository {
  constructor(protected readonly prismaService: PrismaService) {
    super();
    this.logger = new Logger(BasePrismaRepository.name);
  }
}
