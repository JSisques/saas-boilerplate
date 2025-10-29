import { AuditAggregate } from '@/audit-context/audit/domain/aggregates/audit.aggregate';
import { AuditWriteRepository } from '@/audit-context/audit/domain/repositories/audit-write.repository';
import { AuditPrismaMapper } from '@/audit-context/audit/infrastructure/prisma/mappers/audit-prisma.mapper';
import { BasePrismaRepository } from '@/shared/infrastructure/database/prisma/base-prisma.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditPrismaRepository
  extends BasePrismaRepository
  implements AuditWriteRepository
{
  constructor(
    prisma: PrismaService,
    private readonly auditPrismaMapper: AuditPrismaMapper,
  ) {
    super(prisma);
    this.logger = new Logger(AuditPrismaRepository.name);
  }

  /**
   * Finds a audit by their id
   *
   * @param id - The id of the audit to find
   * @returns The audit if found, null otherwise
   */
  async findById(id: string): Promise<AuditAggregate | null> {
    this.logger.log(`Finding audit by id: ${id}`);

    const auditData = await this.prismaService.audit.findUnique({
      where: { id },
    });

    if (!auditData) {
      return null;
    }

    return this.auditPrismaMapper.toDomainEntity(auditData);
  }

  /**
   * Saves a user
   *
   * @param audit - The audit to save
   * @returns The saved audit
   */
  async save(audit: AuditAggregate): Promise<AuditAggregate> {
    this.logger.log(`Saving audit: ${JSON.stringify(audit)}`);

    const auditData = this.auditPrismaMapper.toPrismaData(audit);

    const result = await this.prismaService.audit.upsert({
      where: { id: audit.id.value },
      update: auditData,
      create: auditData,
    });

    return this.auditPrismaMapper.toDomainEntity(result);
  }

  /**
   * Deletes a user
   *
   * @param audit - The audit to delete
   * @returns True if the user was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting audit by id: ${id}`);

    await this.prismaService.audit.delete({
      where: { id },
    });

    return true;
  }
}
