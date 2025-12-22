import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('subscription_plans')
@Index(['slug'], { unique: true })
@Index(['type'])
export class SubscriptionPlanTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column({
    type: 'enum',
    enum: SubscriptionPlanTypeEnum,
  })
  type: SubscriptionPlanTypeEnum;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceMonthly: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceYearly: number;

  @Column({
    type: 'enum',
    enum: SubscriptionPlanCurrencyEnum,
  })
  currency: SubscriptionPlanCurrencyEnum;

  @Column({
    type: 'enum',
    enum: SubscriptionPlanIntervalEnum,
  })
  interval: SubscriptionPlanIntervalEnum;

  @Column({ type: 'integer' })
  intervalCount: number;

  @Column({ type: 'integer', nullable: true })
  trialPeriodDays: number | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  features: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  limits: Record<string, unknown> | null;

  @Column({ type: 'varchar', nullable: true })
  stripePriceId: string | null;
}
