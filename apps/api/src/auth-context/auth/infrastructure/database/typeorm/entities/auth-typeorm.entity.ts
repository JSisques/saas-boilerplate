import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('auth')
@Index(['email'])
@Index(['userId'])
export class AuthTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  userId: string;

  @Column({
    type: 'enum',
    enum: AuthProviderEnum,
  })
  provider: AuthProviderEnum;

  @Column({ type: 'varchar', nullable: true })
  providerId: string | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string | null;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;
}
