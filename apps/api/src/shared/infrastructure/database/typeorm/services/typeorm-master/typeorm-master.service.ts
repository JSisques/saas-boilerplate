import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TypeormMasterService {
  private readonly logger = new Logger(TypeormMasterService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.logger.log('TypeORM Master database connection initialized');
  }

  /**
   * Get the TypeORM DataSource instance
   * @returns DataSource instance
   */
  getDataSource(): DataSource {
    return this.dataSource;
  }

  /**
   * Get a repository for a specific entity
   * @param entityClass - The entity class
   * @returns Repository instance
   */
  getRepository<T>(entityClass: new () => T): Repository<T> {
    return this.getDataSource().getRepository(entityClass);
  }

  /**
   * Get the EntityManager
   * @returns EntityManager instance
   */
  getEntityManager() {
    return this.getDataSource().manager;
  }
}
