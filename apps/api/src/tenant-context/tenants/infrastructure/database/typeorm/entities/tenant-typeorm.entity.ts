import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { Column, Entity, Index } from 'typeorm';

@Entity('tenants')
@Index(['slug'])
export class TenantTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: true })
  websiteUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  logoUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  faviconUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  primaryColor: string | null;

  @Column({ type: 'varchar', nullable: true })
  secondaryColor: string | null;

  @Column({
    type: 'enum',
    enum: TenantStatusEnum,
  })
  status: TenantStatusEnum;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string | null;

  @Column({ type: 'varchar', nullable: true })
  phoneCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', nullable: true })
  city: string | null;

  @Column({ type: 'varchar', nullable: true })
  state: string | null;

  @Column({ type: 'varchar', nullable: true })
  country: string | null;

  @Column({ type: 'varchar', nullable: true })
  postalCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  timezone: string | null;

  @Column({ type: 'varchar', nullable: true })
  locale: string | null;

  @Column({ type: 'integer', nullable: true })
  maxUsers: number | null;

  @Column({ type: 'integer', nullable: true })
  maxStorage: number | null;

  @Column({ type: 'integer', nullable: true })
  maxApiCalls: number | null;
}
