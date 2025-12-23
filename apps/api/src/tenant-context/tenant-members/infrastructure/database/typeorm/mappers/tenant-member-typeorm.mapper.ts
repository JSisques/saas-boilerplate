import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberAggregateFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-aggregate/tenant-member-aggregate.factory';
import { TenantMemberTypeormEntity } from '@/tenant-context/tenant-members/infrastructure/database/typeorm/entities/tenant-member-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantMemberTypeormMapper {
  private readonly logger = new Logger(TenantMemberTypeormMapper.name);

  constructor(
    private readonly tenantMemberAggregateFactory: TenantMemberAggregateFactory,
  ) {}

  /**
   * Converts a TypeORM entity to a tenant member aggregate
   *
   * @param tenantMemberEntity - The TypeORM entity to convert
   * @returns The tenant member aggregate
   */
  toDomainEntity(
    tenantMemberEntity: TenantMemberTypeormEntity,
  ): TenantMemberAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${tenantMemberEntity.id}`,
    );

    return this.tenantMemberAggregateFactory.fromPrimitives({
      id: tenantMemberEntity.id,
      tenantId: tenantMemberEntity.tenantId,
      userId: tenantMemberEntity.userId,
      role: tenantMemberEntity.role,
      createdAt: tenantMemberEntity.createdAt,
      updatedAt: tenantMemberEntity.updatedAt,
    });
  }

  /**
   * Converts a tenant member aggregate to a TypeORM entity
   *
   * @param tenantMember - The tenant member aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(
    tenantMember: TenantMemberAggregate,
  ): TenantMemberTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${tenantMember.id.value} to TypeORM entity`,
    );

    const primitives = tenantMember.toPrimitives();

    const entity = new TenantMemberTypeormEntity();

    entity.id = primitives.id;
    entity.tenantId = primitives.tenantId;
    entity.userId = primitives.userId;
    entity.role = primitives.role as TenantMemberRoleEnum;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
