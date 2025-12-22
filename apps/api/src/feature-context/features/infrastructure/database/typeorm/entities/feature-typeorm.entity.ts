import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('features')
@Index(['key'], { unique: true })
export class FeatureTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar', unique: true })
  key: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: FeatureStatusEnum,
  })
  status: FeatureStatusEnum;
}
