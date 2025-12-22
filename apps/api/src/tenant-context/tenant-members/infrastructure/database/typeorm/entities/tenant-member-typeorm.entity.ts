import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { Column, Entity, Index } from 'typeorm';

@Entity('tenant_members')
@Index(['tenantId'])
@Index(['userId'])
@Index(['tenantId', 'userId'], { unique: true })
export class TenantMemberTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  tenantId: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({
    type: 'enum',
    enum: TenantMemberRoleEnum,
  })
  role: TenantMemberRoleEnum;
}
