import { AuditViewModel } from '@/audit/domain/view-models/audit.view-model';
import { AuditMongoDbDto } from '@/audit/infrastructure/mongodb/dtos/audit-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

export const AUDIT_MONGODB_MAPPER_TOKEN = Symbol('AuditMongoDBMapper');

@Injectable()
export class AuditMongoDBMapper {
  private readonly logger = new Logger(AuditMongoDBMapper.name);
  /**
   * Converts a MongoDB document to a audit view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The audit view model
   */
  toViewModel(doc: AuditMongoDbDto): AuditViewModel {
    this.logger.log(
      `Converting MongoDB document to audit view model with id ${doc.id}`,
    );

    return new AuditViewModel({
      id: doc.id,
      eventType: doc.eventType,
      aggregateType: doc.aggregateType,
      aggregateId: doc.aggregateId,
      payload: doc.payload,
      timestamp: doc.timestamp,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  /**
   * Converts a audit view model to a MongoDB document
   *
   * @param auditViewModel - The audit view model to convert
   * @returns The MongoDB document
   */
  toMongoData(auditViewModel: AuditViewModel): AuditMongoDbDto {
    this.logger.log(
      `Converting audit view model with id ${auditViewModel.id} to MongoDB document`,
    );

    return {
      id: auditViewModel.id,
      eventType: auditViewModel.eventType,
      aggregateType: auditViewModel.aggregateType,
      aggregateId: auditViewModel.aggregateId,
      payload: auditViewModel.payload,
      timestamp: auditViewModel.timestamp,
      createdAt: auditViewModel.createdAt,
      updatedAt: auditViewModel.updatedAt,
    };
  }
}
