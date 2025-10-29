import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { TenantAggregateFactory } from '@/tenant-context/tenants/domain/factories/tenant-aggregate.factory';
import { TenantPrismaDto } from '@/tenant-context/tenants/infrastructure/database/prisma/dtos/tenant-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';
import { TenantStatusEnum } from '@prisma/client';

@Injectable()
export class TenantPrismaMapper {
  private readonly logger = new Logger(TenantPrismaMapper.name);

  constructor(
    private readonly tenantAggregateFactory: TenantAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a tenant aggregate
   *
   * @param tenantData - The Prisma data to convert
   * @returns The tenant aggregate
   */
  toDomainEntity(tenantData: TenantPrismaDto): TenantAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${tenantData.id}`,
    );

    return this.tenantAggregateFactory.fromPrimitives({
      id: tenantData.id,
      name: tenantData.name,
      slug: tenantData.slug,
      description: tenantData.description,
      websiteUrl: tenantData.websiteUrl,
      logoUrl: tenantData.logoUrl,
      faviconUrl: tenantData.faviconUrl,
      primaryColor: tenantData.primaryColor,
      secondaryColor: tenantData.secondaryColor,
      status: tenantData.status,
      email: tenantData.email,
      phoneNumber: tenantData.phoneNumber,
      phoneCode: tenantData.phoneCode,
      address: tenantData.address,
      city: tenantData.city,
      state: tenantData.state,
      country: tenantData.country,
      postalCode: tenantData.postalCode,
      timezone: tenantData.timezone,
      locale: tenantData.locale,
      maxUsers: tenantData.maxUsers,
      maxStorage: tenantData.maxStorage,
      maxApiCalls: tenantData.maxApiCalls,
    });
  }

  /**
   * Converts a tenant aggregate to a Prisma data
   *
   * @param tenant - The tenant aggregate to convert
   * @returns The Prisma data
   */
  toPrismaData(tenant: TenantAggregate): TenantPrismaDto {
    this.logger.log(
      `Converting domain entity with id ${tenant.id.value} to Prisma data`,
    );

    // Get primitives from aggregate
    const primitives = tenant.toPrimitives();

    return {
      id: primitives.id,
      name: primitives.name,
      slug: primitives.slug,
      description: primitives.description,
      websiteUrl: primitives.websiteUrl,
      logoUrl: primitives.logoUrl,
      faviconUrl: primitives.faviconUrl,
      primaryColor: primitives.primaryColor,
      secondaryColor: primitives.secondaryColor,
      status: primitives.status as TenantStatusEnum,
      email: primitives.email,
      phoneNumber: primitives.phoneNumber,
      phoneCode: primitives.phoneCode,
      address: primitives.address,
      city: primitives.city,
      state: primitives.state,
      country: primitives.country,
      postalCode: primitives.postalCode,
      timezone: primitives.timezone,
      locale: primitives.locale,
      maxUsers: primitives.maxUsers,
      maxStorage: primitives.maxStorage,
      maxApiCalls: primitives.maxApiCalls,
    };
  }
}
