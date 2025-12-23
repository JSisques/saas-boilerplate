import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberWriteRepository } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { TenantMemberTypeormEntity } from '@/tenant-context/tenant-members/infrastructure/database/typeorm/entities/tenant-member-typeorm.entity';
import { TenantMemberTypeormMapper } from '@/tenant-context/tenant-members/infrastructure/database/typeorm/mappers/tenant-member-typeorm.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantMemberTypeormRepository
  extends BaseTypeormMasterRepository<TenantMemberTypeormEntity>
  implements TenantMemberWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly tenantMemberTypeormMapper: TenantMemberTypeormMapper,
  ) {
    super(typeormMasterService, TenantMemberTypeormEntity);
    this.logger = new Logger(TenantMemberTypeormRepository.name);
  }

  /**
   * Finds a tenant member by their id
   *
   * @param id - The id of the tenant member to find
   * @returns The tenant member if found, null otherwise
   */
  async findById(id: string): Promise<TenantMemberAggregate | null> {
    this.logger.log(`Finding tenant member by id: ${id}`);
    const tenantMemberEntity = await this.repository.findOne({
      where: { id },
    });

    return tenantMemberEntity
      ? this.tenantMemberTypeormMapper.toDomainEntity(tenantMemberEntity)
      : null;
  }

  /**
   * Finds tenant members by their tenant id
   *
   * @param tenantId - The id of the tenant to find tenant members by
   * @returns The tenant members if found, null otherwise
   */
  async findByTenantId(
    tenantId: string,
  ): Promise<TenantMemberAggregate[] | null> {
    this.logger.log(`Finding tenant members by tenant id: ${tenantId}`);
    const tenantMemberEntities = await this.repository.find({
      where: { tenantId },
    });

    return tenantMemberEntities.length > 0
      ? tenantMemberEntities.map((entity) =>
          this.tenantMemberTypeormMapper.toDomainEntity(entity),
        )
      : null;
  }

  /**
   * Finds tenant members by user id
   *
   * @param userId - The id of the user to find tenant members by
   * @returns The tenant members found
   */
  async findByUserId(userId: string): Promise<TenantMemberAggregate[] | null> {
    this.logger.log(`Finding tenant members by user id: ${userId}`);
    const tenantMemberEntities = await this.repository.find({
      where: { userId },
    });

    return tenantMemberEntities.length > 0
      ? tenantMemberEntities.map((entity) =>
          this.tenantMemberTypeormMapper.toDomainEntity(entity),
        )
      : null;
  }

  /**
   * Finds a tenant member by tenant id and user id
   *
   * @param tenantId - The id of the tenant to find tenant members by
   * @param userId - The id of the user to find tenant members by
   * @returns The tenant member if found, null otherwise
   */
  async findByTenantIdAndUserId(
    tenantId: string,
    userId: string,
  ): Promise<TenantMemberAggregate | null> {
    this.logger.log(
      `Finding tenant member by tenant id: ${tenantId} and user id: ${userId}`,
    );
    const tenantMemberEntity = await this.repository.findOne({
      where: { tenantId, userId },
    });

    return tenantMemberEntity
      ? this.tenantMemberTypeormMapper.toDomainEntity(tenantMemberEntity)
      : null;
  }

  /**
   * Saves a tenant member
   *
   * @param tenantMember - The tenant member to save
   * @returns The saved tenant member
   */
  async save(
    tenantMember: TenantMemberAggregate,
  ): Promise<TenantMemberAggregate> {
    this.logger.log(`Saving tenant member: ${tenantMember.id.value}`);
    const tenantMemberEntity =
      this.tenantMemberTypeormMapper.toTypeormEntity(tenantMember);

    const savedEntity = await this.repository.save(tenantMemberEntity);

    return this.tenantMemberTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a tenant member (soft delete)
   *
   * @param id - The id of the tenant member to delete
   * @returns True if the tenant member was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Soft deleting tenant member by id: ${id}`);

    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && result.affected > 0;
  }
}
