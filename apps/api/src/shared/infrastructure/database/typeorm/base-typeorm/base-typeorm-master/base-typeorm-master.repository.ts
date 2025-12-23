import { BaseDatabaseRepository } from '@/shared/infrastructure/database/base-database.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

export abstract class BaseTypeormMasterRepository<
  T,
> extends BaseDatabaseRepository {
  protected readonly repository: Repository<T>;

  constructor(
    protected readonly typeormMasterService: TypeormMasterService,
    entityClass: new () => T,
  ) {
    super();
    this.logger = new Logger(BaseTypeormMasterRepository.name);
    this.repository = this.typeormMasterService.getRepository(entityClass);
  }

  /**
   * Get a repository for a specific entity
   * Helper method to avoid repeating the same code in each repository
   *
   * @param entityClass - The entity class
   * @returns Repository instance
   */
  protected getRepository<U>(entityClass: new () => U): Repository<U> {
    return this.typeormMasterService.getRepository(entityClass);
  }
}
