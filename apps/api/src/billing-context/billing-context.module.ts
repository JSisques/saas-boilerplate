import { SubscriptionPlanModule } from '@/billing-context/subscription-plan/subscription-plan.module';
import { SubscriptionModule } from '@/billing-context/subscription/subscription.module';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const MODULES = [SubscriptionPlanModule, SubscriptionModule];

@Module({
  imports: [SharedModule, ...MODULES],
  controllers: [],
  providers: [],
  exports: [...MODULES],
})
export class BillingContextModule {}
