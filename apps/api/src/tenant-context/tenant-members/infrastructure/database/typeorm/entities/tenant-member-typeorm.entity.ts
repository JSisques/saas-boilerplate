import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { BaseTypeormWithTenantEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm-with-tenant.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('tenant_members')
@Index(['userId'])
@Index(['tenantId', 'userId'], { unique: true })
export class TenantMemberTypeormEntity extends BaseTypeormWithTenantEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: TenantMemberRoleEnum,
  })
  role: TenantMemberRoleEnum;
}
