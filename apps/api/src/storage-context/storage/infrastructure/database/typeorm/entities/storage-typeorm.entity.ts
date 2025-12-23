import { BaseTypeormWithTenantEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm-with-tenant.entity';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { Column, Entity, Index } from 'typeorm';

@Entity('storages')
@Index(['path'])
export class StorageTypeormEntity extends BaseTypeormWithTenantEntity {
  @Column({ type: 'varchar' })
  fileName: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ type: 'varchar' })
  mimeType: string;

  @Column({
    type: 'enum',
    enum: StorageProviderEnum,
  })
  provider: StorageProviderEnum;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'varchar' })
  path: string;
}
