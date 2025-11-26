import { BaseDatabaseRepository } from '@/shared/infrastructure/database/base-database.repository';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { Logger } from '@nestjs/common';

export class BasePrismaMasterRepository extends BaseDatabaseRepository {
  constructor(protected readonly prismaMasterService: PrismaMasterService) {
    super();
    this.logger = new Logger(BasePrismaMasterRepository.name);
  }
}
