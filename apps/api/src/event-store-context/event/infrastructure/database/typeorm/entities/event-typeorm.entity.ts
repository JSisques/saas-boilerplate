import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('events')
@Index(['aggregateId'])
@Index(['aggregateType'])
@Index(['eventType'])
@Index(['timestamp'])
export class EventTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  eventType: string;

  @Column({ type: 'varchar' })
  aggregateType: string;

  @Column({ type: 'varchar' })
  aggregateId: string;

  @Column({ type: 'jsonb', nullable: true })
  payload: Record<string, unknown> | null;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
