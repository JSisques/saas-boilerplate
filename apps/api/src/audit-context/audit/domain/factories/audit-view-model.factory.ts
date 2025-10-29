import { AuditAggregate } from '@/audit-context/audit/domain/aggregates/audit.aggregate';
import { IAuditCreateViewModelDto } from '@/audit-context/audit/domain/dtos/view-models/audit-create/audit-create-view-model.dto';
import { AuditPrimitives } from '@/audit-context/audit/domain/primitives/audit.primitives';
import { AuditViewModel } from '@/audit-context/audit/domain/view-models/audit.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

/**
 * This factory class is used to create a new audit view model.
 */
@Injectable()
export class AuditViewModelFactory
  implements
    IReadFactory<
      AuditViewModel,
      IAuditCreateViewModelDto,
      AuditAggregate,
      AuditPrimitives
    >
{
  private readonly logger = new Logger(AuditViewModelFactory.name);

  /**
   * Creates a new audit view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: IAuditCreateViewModelDto): AuditViewModel {
    this.logger.log(`Creating audit view model from DTO: ${data}`);
    return new AuditViewModel(data);
  }

  /**
   * Creates a new audit view model from a audit primitives.
   *
   * @param primitives - The audit primitive to create the view model from.
   * @returns The audit view model.
   */
  fromPrimitives(primitives: AuditPrimitives): AuditViewModel {
    const now = new Date();

    return new AuditViewModel({
      id: primitives.id,
      eventType: primitives.eventType,
      aggregateType: primitives.aggregateType,
      aggregateId: primitives.aggregateId,
      payload: primitives.payload,
      timestamp: primitives.timestamp,
      createdAt: now,
      updatedAt: now,
    });
  }
  /**
   * Creates a new audit view model from a audit domain aggregate.
   *
   * @param aggregate - The audit aggregate to create the view model from.
   * @returns The audit view model.
   */
  fromAggregate(aggregate: AuditAggregate): AuditViewModel {
    const now = new Date();

    return new AuditViewModel({
      id: aggregate.id.value,
      eventType: aggregate.eventType.value,
      aggregateType: aggregate.aggregateType.value,
      aggregateId: aggregate.aggregateId.value,
      payload: aggregate.payload?.value,
      timestamp: aggregate.timestamp.value,
      createdAt: now,
      updatedAt: now,
    });
  }
}
