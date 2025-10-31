import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import { EventMongoDto } from '@/event-store-context/event/infrastructure/mongodb/dtos/event-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EventMongoMapper {
  private readonly logger = new Logger(EventMongoMapper.name);
  /**
   * Converts a MongoDB document to a event view model
   *
   * @param doc - The MongoDB document to convert
   * @returns The event view model
   */
  toViewModel(doc: EventMongoDto): EventViewModel {
    this.logger.log(
      `Converting MongoDB document to event view model with id ${doc.id}`,
    );

    return new EventViewModel({
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
   * Converts a event view model to a MongoDB document
   *
   * @param EventViewModel - The event view model to convert
   * @returns The MongoDB document
   */
  toMongoData(EventViewModel: EventViewModel): EventMongoDto {
    this.logger.log(
      `Converting event view model with id ${EventViewModel.id} to MongoDB document`,
    );

    return {
      id: EventViewModel.id,
      eventType: EventViewModel.eventType,
      aggregateType: EventViewModel.aggregateType,
      aggregateId: EventViewModel.aggregateId,
      payload: EventViewModel.payload,
      timestamp: EventViewModel.timestamp,
      createdAt: EventViewModel.createdAt,
      updatedAt: EventViewModel.updatedAt,
    };
  }
}
