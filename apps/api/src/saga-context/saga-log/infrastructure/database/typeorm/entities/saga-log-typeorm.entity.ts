import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { Column, Entity, Index } from 'typeorm';

@Entity('saga_logs')
@Index(['sagaInstanceId'])
@Index(['sagaStepId'])
export class SagaLogTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  sagaInstanceId: string;

  @Column({ type: 'varchar' })
  sagaStepId: string;

  @Column({
    type: 'enum',
    enum: SagaLogTypeEnum,
  })
  type: SagaLogTypeEnum;

  @Column({ type: 'text' })
  message: string;
}
