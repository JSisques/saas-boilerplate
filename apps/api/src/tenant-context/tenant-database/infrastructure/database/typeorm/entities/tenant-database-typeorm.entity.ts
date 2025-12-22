import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { Column, Entity, Index } from 'typeorm';

@Entity('tenant_databases')
@Index(['tenantId'])
export class TenantDatabaseTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  tenantId: string;

  @Column({ type: 'varchar' })
  databaseName: string;

  @Column({ type: 'varchar' })
  readDatabaseName: string;

  @Column({
    type: 'enum',
    enum: TenantDatabaseStatusEnum,
  })
  status: TenantDatabaseStatusEnum;

  @Column({ type: 'varchar', nullable: true })
  schemaVersion: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastMigrationAt: Date | null;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;
}
