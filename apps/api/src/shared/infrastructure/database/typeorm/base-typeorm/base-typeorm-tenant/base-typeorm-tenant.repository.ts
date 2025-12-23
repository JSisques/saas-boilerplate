import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { BaseTypeormWithTenantEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm-with-tenant.entity';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Injectable, Scope } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';

/**
 * Base repository for TypeORM entities that require tenant isolation.
 * Automatically filters all queries by tenantId to ensure data isolation.
 *
 * This class extends BaseTypeormMasterRepository and adds automatic tenant filtering
 * to all find, save, and delete operations.
 *
 * @template T - Entity type that extends BaseTypeormWithTenantEntity
 *
 * @example
 * ```typescript
 * @Injectable({ scope: Scope.REQUEST })
 * export class MyRepository extends BaseTypeormTenantRepository<MyEntity> {
 *   constructor(
 *     typeormMasterService: TypeormMasterService,
 *     tenantContextService: TenantContextService,
 *   ) {
 *     super(typeormMasterService, tenantContextService, MyEntity);
 *   }
 * }
 * ```
 */
@Injectable({ scope: Scope.REQUEST })
export abstract class BaseTypeormTenantRepository<
  T extends BaseTypeormWithTenantEntity,
> extends BaseTypeormMasterRepository<T> {
  constructor(
    typeormMasterService: TypeormMasterService,
    protected readonly tenantContextService: TenantContextService,
    entityClass: new () => T,
  ) {
    super(typeormMasterService, entityClass);
  }

  /**
   * Get the current tenant ID from the tenant context service.
   * @throws {Error} Throws if tenant ID is not found.
   */
  protected get tenantId(): string {
    return this.tenantContextService.getTenantIdOrThrow();
  }

  /**
   * Automatically adds tenantId to WHERE conditions
   */
  private addTenantFilter<TWhere extends Record<string, any>>(
    where: TWhere | undefined,
  ): TWhere & { tenantId: string } {
    return {
      ...where,
      tenantId: this.tenantId,
    } as TWhere & { tenantId: string };
  }

  /**
   * Find one entity by options, automatically filtered by tenantId
   */
  async findOne(options?: FindOneOptions<T>): Promise<T | null> {
    const tenantFilteredOptions: FindOneOptions<T> = {
      ...options,
      where: this.addTenantFilter(options?.where as any),
    };

    return this.repository.findOne(tenantFilteredOptions);
  }

  /**
   * Find entities by options, automatically filtered by tenantId
   */
  async find(options?: FindManyOptions<T>): Promise<T[]> {
    const tenantFilteredOptions: FindManyOptions<T> = {
      ...options,
      where: this.addTenantFilter(options?.where as any),
    };

    return this.repository.find(tenantFilteredOptions);
  }

  /**
   * Find entities and count, automatically filtered by tenantId
   */
  async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    const tenantFilteredOptions: FindManyOptions<T> = {
      ...options,
      where: this.addTenantFilter(options?.where as any),
    };

    return this.repository.findAndCount(tenantFilteredOptions);
  }

  /**
   * Count entities, automatically filtered by tenantId
   */
  async count(options?: FindManyOptions<T>): Promise<number> {
    const tenantFilteredOptions: FindManyOptions<T> = {
      ...options,
      where: this.addTenantFilter(options?.where as any),
    };

    return this.repository.count(tenantFilteredOptions);
  }

  /**
   * Find one entity by ID, automatically filtered by tenantId
   * Protected to avoid conflicts with domain repository interfaces
   */
  protected async findEntityById(id: string): Promise<T | null> {
    return this.findOne({ where: { id } as any });
  }

  /**
   * Save entity, automatically setting tenantId if not present
   * Protected to avoid conflicts with domain repository interfaces
   */
  protected async saveEntity(entity: DeepPartial<T>): Promise<T> {
    const entityToSave = { ...entity } as T;

    // Ensure tenantId is always set
    if (!entityToSave.tenantId) {
      entityToSave.tenantId = this.tenantId;
    } else if (entityToSave.tenantId !== this.tenantId) {
      throw new Error(
        'Cannot save entity with different tenantId. Tenant isolation violation.',
      );
    }

    return this.repository.save(entityToSave);
  }

  /**
   * Save multiple entities, automatically setting tenantId if not present
   */
  async saveMany(entities: DeepPartial<T>[]): Promise<T[]> {
    const entitiesToSave = entities.map((entity) => {
      const entityToSave = { ...entity } as T;

      // Ensure tenantId is always set
      if (!entityToSave.tenantId) {
        entityToSave.tenantId = this.tenantId;
      } else if (entityToSave.tenantId !== this.tenantId) {
        throw new Error(
          'Cannot save entity with different tenantId. Tenant isolation violation.',
        );
      }

      return entityToSave;
    });

    return this.repository.save(entitiesToSave);
  }

  /**
   * Soft delete entity by ID, automatically filtered by tenantId
   */
  async softDelete(id: string): Promise<DeleteResult> {
    return this.repository.softDelete({ id, tenantId: this.tenantId } as any);
  }

  /**
   * Soft delete entities by criteria, automatically filtered by tenantId
   */
  async softDeleteBy(criteria: Partial<T>): Promise<DeleteResult> {
    return this.repository.softDelete({
      ...criteria,
      tenantId: this.tenantId,
    } as any);
  }

  /**
   * Delete entity by ID, automatically filtered by tenantId
   * Protected to avoid conflicts with domain repository interfaces
   */
  protected async deleteEntity(id: string): Promise<DeleteResult> {
    return this.repository.delete({ id, tenantId: this.tenantId } as any);
  }

  /**
   * Delete entities by criteria, automatically filtered by tenantId
   */
  async deleteBy(criteria: Partial<T>): Promise<DeleteResult> {
    return this.repository.delete({
      ...criteria,
      tenantId: this.tenantId,
    } as any);
  }

  /**
   * Check if entity exists, automatically filtered by tenantId
   */
  async exists(options?: FindOneOptions<T>): Promise<boolean> {
    const count = await this.count(options as FindManyOptions<T>);
    return count > 0;
  }

  /**
   * Check if entity exists by ID, automatically filtered by tenantId
   */
  async existsById(id: string): Promise<boolean> {
    return this.exists({ where: { id } as any });
  }
}
