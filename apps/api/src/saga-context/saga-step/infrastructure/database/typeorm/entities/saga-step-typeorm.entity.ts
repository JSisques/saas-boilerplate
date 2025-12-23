import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { Column, Entity, Index } from 'typeorm';

@Entity('saga_steps')
@Index(['sagaInstanceId'])
export class SagaStepTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  sagaInstanceId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer' })
  order: number;

  @Column({
    type: 'enum',
    enum: SagaStepStatusEnum,
  })
  status: SagaStepStatusEnum;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date | null;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ type: 'integer', default: 0 })
  retryCount: number;

  @Column({ type: 'integer', default: 0 })
  maxRetries: number;

  @Column({ type: 'jsonb', nullable: true })
  payload: any;

  @Column({ type: 'jsonb', nullable: true })
  result: any;
}
