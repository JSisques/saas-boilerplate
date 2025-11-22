import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberAggregateFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-aggregate/tenant-member-aggregate.factory';
import { TenantMemberPrismaDto } from '@/tenant-context/tenant-members/infrastructure/database/prisma/dtos/tenant-member-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';
import { TenantMemberRoleEnum } from '@prisma/client';

@Injectable()
export class TenantMemberPrismaMapper {
  private readonly logger = new Logger(TenantMemberPrismaMapper.name);

  constructor(
    private readonly tenantMemberAggregateFactory: TenantMemberAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a tenant member aggregate
   *
   * @param tenantMemberData - The Prisma data to convert
   * @returns The tenant member aggregate
   */
  toDomainEntity(
    tenantMemberData: TenantMemberPrismaDto,
  ): TenantMemberAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${tenantMemberData.id}`,
    );

    return this.tenantMemberAggregateFactory.fromPrimitives({
      id: tenantMemberData.id,
      tenantId: tenantMemberData.tenantId,
      userId: tenantMemberData.userId,
      role: tenantMemberData.role,
      createdAt: new Date(tenantMemberData.createdAt),
      updatedAt: new Date(tenantMemberData.updatedAt),
    });
  }

  /**
   * Converts a tenant member aggregate to a Prisma data
   *
   * @param tenantMember - The tenant member aggregate to convert
   * @returns The Prisma data
   */
  public toPrismaData(
    tenantMember: TenantMemberAggregate,
  ): TenantMemberPrismaDto {
    this.logger.log(
      `Converting domain entity with id ${tenantMember.id.value} to Prisma data`,
    );

    // Get primitives from aggregate
    const primitives = tenantMember.toPrimitives();

    return {
      id: primitives.id,
      tenantId: primitives.tenantId,
      userId: primitives.userId,
      role: primitives.role as TenantMemberRoleEnum,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
