import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantAggregateFactory } from '@/tenant-context/tenants/domain/factories/tenant-aggregate/tenant-aggregate.factory';
import { TenantTypeormEntity } from '@/tenant-context/tenants/infrastructure/database/typeorm/entities/tenant-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantTypeormMapper {
  private readonly logger = new Logger(TenantTypeormMapper.name);

  constructor(
    private readonly tenantAggregateFactory: TenantAggregateFactory,
  ) {}

  /**
   * Converts a TypeORM entity to a tenant aggregate
   *
   * @param tenantEntity - The TypeORM entity to convert
   * @returns The tenant aggregate
   */
  toDomainEntity(tenantEntity: TenantTypeormEntity): TenantAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${tenantEntity.id}`,
    );

    return this.tenantAggregateFactory.fromPrimitives({
      id: tenantEntity.id,
      name: tenantEntity.name,
      slug: tenantEntity.slug,
      description: tenantEntity.description ?? null,
      websiteUrl: tenantEntity.websiteUrl ?? null,
      logoUrl: tenantEntity.logoUrl ?? null,
      faviconUrl: tenantEntity.faviconUrl ?? null,
      primaryColor: tenantEntity.primaryColor ?? null,
      secondaryColor: tenantEntity.secondaryColor ?? null,
      status: tenantEntity.status,
      email: tenantEntity.email ?? null,
      phoneNumber: tenantEntity.phoneNumber ?? null,
      phoneCode: tenantEntity.phoneCode ?? null,
      address: tenantEntity.address ?? null,
      city: tenantEntity.city ?? null,
      state: tenantEntity.state ?? null,
      country: tenantEntity.country ?? null,
      postalCode: tenantEntity.postalCode ?? null,
      timezone: tenantEntity.timezone ?? null,
      locale: tenantEntity.locale ?? null,
      maxUsers: tenantEntity.maxUsers ?? null,
      maxStorage: tenantEntity.maxStorage ?? null,
      maxApiCalls: tenantEntity.maxApiCalls ?? null,
      createdAt: tenantEntity.createdAt,
      updatedAt: tenantEntity.updatedAt,
    });
  }

  /**
   * Converts a tenant aggregate to a TypeORM entity
   *
   * @param tenant - The tenant aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(tenant: TenantAggregate): TenantTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${tenant.id.value} to TypeORM entity`,
    );

    const primitives = tenant.toPrimitives();

    const entity = new TenantTypeormEntity();

    entity.id = primitives.id;
    entity.name = primitives.name;
    entity.slug = primitives.slug;
    entity.description = primitives.description;
    entity.websiteUrl = primitives.websiteUrl;
    entity.logoUrl = primitives.logoUrl;
    entity.faviconUrl = primitives.faviconUrl;
    entity.primaryColor = primitives.primaryColor;
    entity.secondaryColor = primitives.secondaryColor;
    entity.status = primitives.status as TenantStatusEnum;
    entity.email = primitives.email;
    entity.phoneNumber = primitives.phoneNumber;
    entity.phoneCode = primitives.phoneCode;
    entity.address = primitives.address;
    entity.city = primitives.city;
    entity.state = primitives.state;
    entity.country = primitives.country;
    entity.postalCode = primitives.postalCode;
    entity.timezone = primitives.timezone;
    entity.locale = primitives.locale;
    entity.maxUsers = primitives.maxUsers;
    entity.maxStorage = primitives.maxStorage;
    entity.maxApiCalls = primitives.maxApiCalls;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
