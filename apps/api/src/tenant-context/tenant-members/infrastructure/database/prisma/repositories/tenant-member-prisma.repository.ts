import { BasePrismaMasterRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-master/base-prisma-master.repository';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberWriteRepository } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { TenantMemberPrismaMapper } from '@/tenant-context/tenant-members/infrastructure/database/prisma/mappers/tenant-member-prisma.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantMemberPrismaRepository
  extends BasePrismaMasterRepository
  implements TenantMemberWriteRepository
{
  constructor(
    prismaMasterService: PrismaMasterService,
    private readonly tenantMemberPrismaMapper: TenantMemberPrismaMapper,
  ) {
    super(prismaMasterService);
    this.logger = new Logger(TenantMemberPrismaRepository.name);
  }

  /**
   * Finds a tenant by their id
   *
   * @param id - The id of the tenant to find
   * @returns The tenant if found, null otherwise
   */
  async findById(id: string): Promise<TenantMemberAggregate | null> {
    const tenantMemberData =
      await this.prismaMasterService.client.tenantMember.findUnique({
        where: { id },
      });

    if (!tenantMemberData) {
      return null;
    }

    return this.tenantMemberPrismaMapper.toDomainEntity(tenantMemberData);
  }

  /**
   * Finds a tenant by their slug
   *
   * @param slug - The slug of the tenant to find
   * @returns The tenant if found, null otherwise
   */
  async findByTenantId(
    tenantId: string,
  ): Promise<TenantMemberAggregate[] | null> {
    const tenantMembersData =
      await this.prismaMasterService.client.tenantMember.findMany({
        where: { tenantId },
      });

    return tenantMembersData.map((tenantMemberData) =>
      this.tenantMemberPrismaMapper.toDomainEntity(tenantMemberData),
    );
  }

  /**
   * Finds tenant members by user id
   *
   * @param userId - The id of the user to find tenant members by
   * @returns The tenant members found
   */
  async findByUserId(userId: string): Promise<TenantMemberAggregate[] | null> {
    const tenantMembersData =
      await this.prismaMasterService.client.tenantMember.findMany({
        where: { userId },
      });

    return tenantMembersData.map((tenantMemberData) =>
      this.tenantMemberPrismaMapper.toDomainEntity(tenantMemberData),
    );
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
    const tenantMemberData =
      await this.prismaMasterService.client.tenantMember.findFirst({
        where: { tenantId, userId },
      });

    return tenantMemberData
      ? this.tenantMemberPrismaMapper.toDomainEntity(tenantMemberData)
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
    const tenantMemberData =
      this.tenantMemberPrismaMapper.toPrismaData(tenantMember);

    const result = await this.prismaMasterService.client.tenantMember.upsert({
      where: { id: tenantMember.id.value },
      update: tenantMemberData,
      create: tenantMemberData,
    });

    return this.tenantMemberPrismaMapper.toDomainEntity(result);
  }

  /**
   * Deletes a tenant member
   *
   * @param tenantMember - The tenant member to delete
   * @returns True if the tenant member was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting tenant member by id: ${id}`);

    await this.prismaMasterService.client.tenantMember.delete({
      where: { id },
    });

    return true;
  }
}
