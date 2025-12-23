import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { Column, Index } from 'typeorm';

export abstract class BaseTypeormWithTenantEntity extends BaseTypeormEntity {
  @Column({ type: 'uuid', nullable: true })
  @Index(['tenantId'])
  tenantId: string | null;
}
