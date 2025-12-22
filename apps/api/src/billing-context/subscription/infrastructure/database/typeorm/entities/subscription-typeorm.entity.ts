import { SubscriptionRenewalMethodEnum } from '@/billing-context/subscription/domain/enum/subscription-renewal-method.enum';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('subscriptions')
@Index(['tenantId'], { unique: true })
export class SubscriptionTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  tenantId: string;

  @Column({ type: 'varchar' })
  planId: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  trialEndDate: Date | null;

  @Column({
    type: 'enum',
    enum: SubscriptionStatusEnum,
  })
  status: SubscriptionStatusEnum;

  @Column({ type: 'varchar', nullable: true })
  stripeSubscriptionId: string | null;

  @Column({ type: 'varchar', nullable: true })
  stripeCustomerId: string | null;

  @Column({
    type: 'enum',
    enum: SubscriptionRenewalMethodEnum,
  })
  renewalMethod: SubscriptionRenewalMethodEnum;
}
