import { AuditAggregate } from '@/audit-context/audit/domain/aggregates/audit.aggregate';
import { AuditAggregateFactory } from '@/audit-context/audit/domain/factories/audit-aggregate.factory';
import { AuditPrismaDto } from '@/audit-context/audit/infrastructure/prisma/dtos/audit-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditPrismaMapper {
  private readonly logger = new Logger(AuditPrismaMapper.name);

  constructor(private readonly auditAggregateFactory: AuditAggregateFactory) {}

  /**
   * Converts a Prisma data to a domain entity
   *
   * @param auditData - The Prisma data to convert
   * @returns The domain entity
   */
  toDomainEntity(auditData: AuditPrismaDto): AuditAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${auditData.id}`,
    );

    return this.auditAggregateFactory.fromPrimitives({
      id: auditData.id,
      eventType: auditData.eventType,
      aggregateType: auditData.aggregateType,
      aggregateId: auditData.aggregateId,
      payload: auditData.payload,
      timestamp: auditData.timestamp,
    });
  }

  /**
   * Converts a domain entity to a Prisma data
   *
   * @param audit - The domain entity to convert
   * @returns The Prisma data
   */
  toPrismaData(audit: AuditAggregate): AuditPrismaDto {
    this.logger.log(
      `Converting domain entity with id ${audit.id.value} to Prisma data`,
    );

    return {
      id: audit.id.value,
      eventType: audit.eventType.value,
      aggregateType: audit.aggregateType.value,
      aggregateId: audit.aggregateId.value,
      payload: audit.payload?.value ?? null,
      timestamp: audit.timestamp.value,
    };
  }
}
