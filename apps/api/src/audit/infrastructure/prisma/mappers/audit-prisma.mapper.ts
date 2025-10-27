import { AuditAggregate } from '@/audit/domain/aggregates/audit.aggregate';
import {
  AUDIT_AGGREGATE_FACTORY_TOKEN,
  AuditAggregateFactory,
} from '@/audit/domain/factories/audit-aggregate.factory';
import { AuditPrismaDto } from '@/audit/infrastructure/prisma/dtos/audit-prisma.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';

export const AUDIT_PRISMA_MAPPER_TOKEN = Symbol('AuditPrismaMapper');

@Injectable()
export class AuditPrismaMapper {
  private readonly logger = new Logger(AuditPrismaMapper.name);

  constructor(
    @Inject(AUDIT_AGGREGATE_FACTORY_TOKEN)
    private readonly auditAggregateFactory: AuditAggregateFactory,
  ) {}

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
