import { SubscriptionRenewalMethodEnum } from '@/billing-context/subscription/domain/enum/subscription-renewal-method.enum';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import { BaseTypeormWithTenantEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm-with-tenant.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('subscriptions')
export class SubscriptionTypeormEntity extends BaseTypeormWithTenantEntity {
  @Column({ type: 'uuid' })
  @Index(['planId'])
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
