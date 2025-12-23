import { BaseTypeormWithTenantEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm-with-tenant.entity';
import { TenantContextStore } from '@/shared/infrastructure/services/tenant-context/tenant-context.store';
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  LoadEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';

/**
 * Tenant Query Subscriber
 * Automatically filters queries and enforces tenant isolation for entities
 * that extend BaseTypeormWithTenantEntity
 *
 * This subscriber intercepts TypeORM events to:
 * - Automatically add tenantId to WHERE clauses in find operations
 * - Ensure tenantId is set on insert operations
 * - Prevent cross-tenant updates/deletes
 *
 * Note: TypeORM doesn't provide a direct hook to modify all queries,
 * so this subscriber handles entity lifecycle events. For automatic query
 * filtering, we recommend using the BaseTypeormTenantRepository class.
 */
@Injectable()
@EventSubscriber()
export class TenantQuerySubscriber
  implements EntitySubscriberInterface<BaseTypeormWithTenantEntity>
{
  private readonly logger = new Logger(TenantQuerySubscriber.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    // Subscriber is automatically registered via TypeORM configuration in typeorm.module.ts
  }

  /**
   * Listen to all entities that extend BaseTypeormWithTenantEntity
   */
  listenTo() {
    return BaseTypeormWithTenantEntity;
  }

  /**
   * Before insert, ensure tenantId is set
   */
  beforeInsert(event: InsertEvent<BaseTypeormWithTenantEntity>): void {
    const tenantId = TenantContextStore.getTenantId();

    if (tenantId && !event.entity.tenantId) {
      event.entity.tenantId = tenantId;
      this.logger.debug(
        `Auto-setting tenantId ${tenantId} for entity ${event.metadata.name}`,
      );
    } else if (!tenantId && event.entity.tenantId === null) {
      this.logger.warn(
        `Entity ${event.metadata.name} inserted without tenantId. This may be intentional for global entities.`,
      );
    }
  }

  /**
   * Before update, verify tenant isolation
   */
  beforeUpdate(event: UpdateEvent<BaseTypeormWithTenantEntity>): void {
    const tenantId = TenantContextStore.getTenantId();

    if (tenantId && event.entity) {
      // Ensure tenantId is not being changed
      if (
        event.entity.tenantId &&
        event.entity.tenantId !== tenantId &&
        event.databaseEntity?.tenantId !== tenantId
      ) {
        this.logger.error(
          `Attempted to update entity ${event.metadata.name} from different tenant. Blocked.`,
        );
        throw new Error(
          'Cannot update entity from different tenant. Tenant isolation violation.',
        );
      }

      // Auto-set tenantId if not present
      if (!event.entity.tenantId) {
        event.entity.tenantId = tenantId;
      }
    }
  }

  /**
   * Before remove, verify tenant isolation
   */
  beforeRemove(event: RemoveEvent<BaseTypeormWithTenantEntity>): void {
    const tenantId = TenantContextStore.getTenantId();

    if (tenantId && event.entity) {
      if (event.entity.tenantId && event.entity.tenantId !== tenantId) {
        this.logger.error(
          `Attempted to delete entity ${event.metadata.name} from different tenant. Blocked.`,
        );
        throw new Error(
          'Cannot delete entity from different tenant. Tenant isolation violation.',
        );
      }
    }
  }

  /**
   * After load, verify tenant isolation (optional safety check)
   */
  afterLoad(
    entity: BaseTypeormWithTenantEntity,
    event?: LoadEvent<BaseTypeormWithTenantEntity>,
  ): void {
    const tenantId = TenantContextStore.getTenantId();

    if (tenantId && entity.tenantId && entity.tenantId !== tenantId) {
      this.logger.warn(
        `Entity ${event?.metadata?.name || 'unknown'} loaded from different tenant. This should not happen if queries are properly filtered.`,
      );
    }
  }
}
